const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
// for parsing json

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

const UserRouter = require("./routes/user");
app.use("/user", UserRouter);
const FilesRouter = require("./routes/files");
app.use("/files", FilesRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});