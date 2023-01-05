const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
console.log("Runing SmartLock");
const mongoIP = process.env.MONGO_IP;
const mongoPORT = process.env.MONGO_PORT;
mongoose
  .connect(`mongodb://${mongoIP}:${mongoPORT}/`, {
    // .connect("mongodb://localhost:27017/", {
    // .connect("mongodb://localhost:27017/", {

    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongo DB");
    app.listen(mongoPORT);
    console.log("Server is listening at ", mongoPORT);
  })
  .catch((err) => {
    console.log("Error Caught : ", err.message);
  });

const lockstatus = require("./apiController/homeDevicesApi");
app.use("/lock", lockstatus);

const port = parseInt(process.env.PORT);
// const port = 8081;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
