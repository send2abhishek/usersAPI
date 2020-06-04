const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.status(201).json({
    msg: "all gud",
  });
});
module.exports = route;
