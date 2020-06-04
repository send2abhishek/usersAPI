const express = require("express");
const route = express.Router();
const controller = require("../Controllers/appController");
const validateUsers = require("../Middlewares/usersValidate");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();

    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".PNG" &&
      ext !== ".jpg" &&
      ext !== ".JPG" &&
      ext !== ".gif" &&
      ext !== ".jpeg"
    ) {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    //file size limited to 2mb
    fileSize: 1024 * 1024 * 2,
  },
});

// all routes
route.post("/avatar", upload.single("avatar"), controller.uploadFile);
route.get("/", controller.getAppData);

route.post("/admin/login", validateUsers.validateUser, controller.login);
route.post(
  "/admin/register",
  validateUsers.validateRegistration,
  controller.register
);

module.exports = route;
