const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
console.log("Runing SmartLock");
const mongoIP = process.env.MONGO_IP;
const appPORT = process.env.APP_PORT;
mongoose
  .connect(`mongodb://${mongoIP}/`, {
    // .connect("mongodb://localhost:27017/", {
    // .connect("mongodb://localhost:27017/", {

    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongo DB");
    app.listen(appPORT);
    console.log("Server is listening at ", appPORT);
  })
  .catch((err) => {
    console.log("Error Caught : ", err.message);
  });

const lockstatus = require("./controller/lockstatus");
app.use("/lock", lockstatus);

const user = require("./controller/user");
app.use("/user", user);

// const port = parseInt(appPORT) || 8080;
const port = appPORT || 3001;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
