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
router.post("/upload", upload.any("files"), (req, res) => {
  var { _id, desc } = req.body;
  if (desc === undefined) desc = "";

  User.findById(_id)
    .then((user) => {
      if (req.files === undefined) return res.status(400).json("error: ", req);

      req.files.forEach((img) => {
        user.imgs.push(img.id);
        user.desc.push(desc);
      });

      user.save().then((user) => res.json(user.imgs));
    })
    .catch((err) => res.status(400).json("error: " + err));
});

/**
 * GET the id of a random image uploaded by _id (username)
 * @param req { _id }
 * @return random img id
 */
router.route("/reminisce").get((req, res) => {
  var { _id } = req.body;
  User.findById(_id)
    .then((user) => {
      const length = user.imgs.length;
      const index = Math.floor(Math.random() * length);
      if (length > 0) {
        const img_id = user.imgs[index];
        res.json({ image: img_id, desc: user.desc[index] });
      }
    })
    .catch((err) => res.status(400).json("error: " + err));
});

/**
 * GET the img of a document based on _id
 * @param req { _id }
 * @return image data
 */
router.get("/get/:imgId", (req, res) => {
  var { _id } = req.body;
  const imgId = req.params.imgId;

  User.findById(_id)
    .then((user) => {
      const index = user.imgs.indexOf(imgId);
      if (index === -1) {
        res.status(400).json("you do not have access");
        return;
      }

      gfs
        .find({
          _id: mongoose.Types.ObjectId(imgId),
        })
        .toArray((err, files) => {
          if (!files || files.length === 0) {
            return res.status(404).json({
              err: "no such files exist",
            });
          }
          gfs.openDownloadStream(mongoose.Types.ObjectId(imgId)).pipe(res);
        });
    })
    .catch((err) => res.status(400).json("error: " + err));
});

/**
 * DELETE one image of user
 * @param req { fid, id }
 * @return
 */
router.route("/delete/:imgId").delete((req, res) => {
  var { _id } = req.body;
  const imgId = req.params.imgId;

  User.findById(_id)
    .then((user) => {
      const index = user.imgs.indexOf(imgId);
      if (index === -1) {
        res.status(400).json("you do not have access");
        return;
      }

      user.desc.splice(index, 1);
      user.imgs.splice(index, 1);

      user.save().then((response) => {
        gfs.delete(new mongoose.Types.ObjectId(imgId), (err, data) => {
          if (err) return res.status(404).json({ err: err.message });
          res.json("document deleted");
        });
      });
    })
    .catch((err) => res.status(400).json("error: you do not have access" + err));
});

/**
 * DELETE existing user
 * @param req { _id }
 * @return
 */
router.route("/delete/account/:id").delete((req, res) => {
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
