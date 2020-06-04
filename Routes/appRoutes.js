const express = require("express");
const route = express.Router();
const controller = require("../Controllers/appController");
route.get("/", controller.getAppData);

module.exports = route;
