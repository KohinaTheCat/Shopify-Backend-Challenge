let User = require("../models/user");
const router = require("express").Router();
const multer = require("multer");
const crypto = require("crypto");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

Grid.mongo = mongoose.mongo;

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

/**
 * POST an image for _id (username)
 * @param req { _id }
 * @return user
 */
router.post("/upload/", upload.any("files"), (req, res) => {
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

/**
 * GET the id of a random image uploaded by _id (username)
 * @param req { _id }
 * @return random img id
 */
router.route("/random/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      const length = user.imgs.length;

      if (length > 0) {
        const img_id = user.imgs[Math.floor(Math.random() * length)]._id;
        res.json(img_id);
      }
    })
    .catch((err) => res.status(400).json("error: " + err));
});

/**
 * GET the img of a document based on _id
 * @param req { _id }
 * @return image data
 */
router.get("/get/:id", (req, res) => {
  gfs
    .find({
      _id: mongoose.Types.ObjectId(req.params.id),
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no such files exist",
        });
      }
      gfs.openDownloadStream(mongoose.Types.ObjectId(req.params.id)).pipe(res);
    });
});

/**
 * DELETE one image of user
 * @param req { fid, id }
 * @return
 */
router.route("/deleteOne/:fid/user/:id").delete((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.imgs = user.imgs;
      user.imgs = user.imgs.filter((img) => img._id === req.params.fid);
      console.log(user.imgs.map((img) => img._id !== req.params.fid));
      gfs.delete(new mongoose.Types.ObjectId(req.params.fid), (err, data) => {
        if (err) return res.status(404).json({ err: err.message });
        res.json("document deleted");
      });
    })
    .catch((err) => res.status(400).json("error: " + err));
});

/**
 * DELETE existing user
 * @param req { _id }
 * @return
 */
router.route("/delete/user/:id").delete((req, res) => {
  User.findOneAndDelete(req.params.id).then((user) => {
    user.imgs
      .forEach((img) => {
        gfs.delete(new mongoose.Types.ObjectId(img._id), (err, data) => {
          if (err) return res.status(404).json({ err: err.message });
          res.json("document deleted");
        });
      })
      .catch((err) => res.status(400).json("error: " + err));
  });
});

module.exports = router;
