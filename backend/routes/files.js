const router = require("express").Router();
let User = require("../models/user");

//connecting to db, init. gridstorage and creating a storage
const multer = require("multer");
const crypto = require("crypto");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");

var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

// .env
require("dotenv").config();
const uri = process.env.ATLAS_URI;

// connection
const conn = mongoose.createConnection(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads", // name of the bucket
  });
});

// init storage
const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage: storage });

// POST add a document
router.post("/user/", upload.any("files"), (req, res) => {
  //.any() : upload any amount of files

  var { _id, desc } = req.body;
  if (desc === undefined) desc = "";

  User.findById(_id)
    .then((user) => {
      if (req.files === undefined) return res.status(400).json("error: ", req);

      user.imgs = user.imgs.concat(
        req.files.map((img) => {
          const container = {};

          container._id = img.id;
          container.desc = desc;

          return container;
        })
      );

      user.save().then((user) => res.json(user));
    })
    .catch((err) => res.status(400).json("error: " + err));
});

// GET a document
router.get("/get/:id", (req, res) => {
  gfs
    .find({
      _id: mongoose.Types.ObjectId(req.params.id),
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist",
        });
      }
      gfs.openDownloadStream(mongoose.Types.ObjectId(req.params.id)).pipe(res);
    });
});

// POST a document
router.post("/delete/:id", (req, res) => {
  gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
    res.json("document deleted");
  });
});

module.exports = router;
