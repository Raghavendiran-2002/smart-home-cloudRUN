const express = require("express");
const mqtt = require("mqtt");
const router = express.Router();
var admin = require("firebase-admin");
require("dotenv").config();
var serviceAccount = require(`${process.env.CRED}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const devicesDB = require("../mongoDBmodels/devicesModel.js");

const host = process.env.MQTT_IP;
const port = process.env.MQTT_PORT;

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

const topic = "/device/status";
client.on("connect", () => {
  console.log("Connected");
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

client.on("message", (topic, payload) => {
  msg = JSON.parse(payload.toString());
  if (msg.hasOwnProperty("status")) {
    syncFirestore(msg["status"], msg["nodeId"], msg["status"]);
    devicesDB
      .find({ deviceID: msg["nodeId"] })
      .updateOne({
        deviceState: msg["status"],
      })
      .then((status) => {
        return;
      })
      .catch((err) => {
        console.log({ success: false, message: err.message });
        return;
      });
  }

  if (msg["status"] == true) {
    console.log(`Device ${msg["nodeId"]} is Open`);
  } else if (msg["status"] == false) {
    console.log(`Device ${msg["nodeId"]}  is Close`);
  }
});

async function syncFirestore(state, nodeID, isUpdate) {
  db = getFirestore();
  const smartlockdb = db
    .collection("devicesRealTime")
    .doc("EcpcZdmxoR6sqQThRacr");
  await smartlockdb.update({
    isRandom: Math.random(),
  });
}

// async function WrongID() {
//   db = getFirestore();
//   const smartlockdb = db.collection("wrongID").doc("6tsfk3UyPScZ6DX7Qhdg");
//   await smartlockdb.update({
//     wrong: Math.random(),
//   });
//   // sendMain();
// }

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/createdevice", (req, res) => {
  devicesDB
    .create({
      deviceID: req.body.deviceID,
      deviceState: req.body.deviceState,
      deviceName: req.body.deviceName,
      deviceType: req.body.deviceType,
    })
    .then((status) => {
      console.log(`Device status... ID : ${req.body}`);
      return res.status(201).json({
        success: true,
        message: "Data Added Successfully",
        quality: status,
      });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err.message });
    });
});

router.post("/updatedevice", (req, res) => {
  devicesDB
    .find({ deviceID: req.body.deviceID })
    .updateOne({
      deviceState: req.body.deviceState,
    })
    .then((status) => {
      console.log(`Updated Device status: ${req.body.deviceState}`);
      msg = JSON.stringify({
        deviceID: req.body.deviceID,
        deviceState: req.body.deviceState,
      });

      client.publish("/smarthome/publishStatus", msg);

      return res.status(201).json({
        success: true,
        message: "Data Updated Successfully",
        quality: status,
      });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err.message });
    });
});

router.get("/getDeviceID", (req, res) => {
  devicesDB
    .find({ deviceID: req.body.deviceID })
    .then((qual) => {
      console.log(`Found Device ID : ${req.body.deviceID}`);
      return res.status(200).json({ success: true, quality: qual });
    })
    .catch((err) => {
      console.log(`no such Device ID found : ${req.body.deviceID}`);
      return res.status(500).json({ success: false, message: err.message });
    });
});

router.get("/deleteDeviceID", (req, res) => {
  devicesDB
    .deleteOne({ deviceID: req.body.deviceID })
    .then((qual) => {
      console.log(`Found Device ID : ${req.body.deviceID}`);
      return res.status(200).json({ success: true, quality: qual });
    })
    .catch((err) => {
      console.log(`no such Device ID found : ${req.body.deviceID}`);
      return res.status(500).json({ success: false, message: err.message });
    });
});

router.get("/getAllDeviceID", (req, res) => {
  devicesDB
    .find({}, {})
    .then((data) => {
      console.log("Retrived All Documents");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});

router.get("/getByDeviceID/:DeviceId", (req, res) => {
  devicesDB
    .find({ deviceID: req.params.deviceID })
    .then((values) => {
      console.log(`Device ID found : ${req.body.deviceID}`);
      return res.status(200).json({ success: true, values: values });
    })
    .catch((err) => {
      console.log(`no such Device ID found : ${req.body.deviceID}`);
      return res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;
