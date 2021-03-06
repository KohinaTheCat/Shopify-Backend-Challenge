const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');

/* The database credentials are stored in an .env. For the sake of this project, I will exclude this from the gitignore. */
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
// start connection

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected!");
});
// connection started

// routes for user
const UserRouter = require("./routes/user");
app.use("/api/user", UserRouter);
// routes dealing with file uploads
const FilesRouter = require("./routes/files");
app.use("/api/user/files", FilesRouter);

app.get('*', function(req, res){
  res.json("Hi!! Refer to https://github.com/KohinaTheCat/Shopify-Backend-Challenge-Rememorer for usage.");
});

const PORT =  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
