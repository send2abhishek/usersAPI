const express = require("express");
const route = express.Router();
const controller = require("../Controllers/appController");
const validateUsers = require("../Middlewares/usersValidate");
route.get("/", controller.getAppData);

route.post("/admin/login", validateUsers.validateUser, controller.login);
route.post(
  "/admin/register",
  validateUsers.validateRegistration,
  controller.register
);
module.exports = route;
