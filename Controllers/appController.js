const appModel = require("../Models/appModel");
const itemModel = require("../Models/itemModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

const getAppData = async (req, res, next) => {
  try {
    let getUsers = await itemModel.find({}, { __v: 0 });
    return res.status(200).json(getUsers);
  } catch (ex) {
    next(ex);
  }
};

const register = async (req, res, next) => {
  try {
    const getExistingUser = await queryUserFromDb(req.body.email);
    if (getExistingUser.length >= 1) {
      return res.status(409).json({
        message: config.get("userExits"),
      });
    } else {
      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const user = new appModel({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            password: hash,
            email: req.body.email,
            country: req.body.country,
            phone: req.body.phone,
          });

          user
            .save()
            .then((result) => {
              res.status(201).json({
                message: config.get("userRegister"),
              });
            })
            .catch((error) => {
              res.status(500).json({
                message: config.get("error"),
                info: error.message,
              });
            });
        }
      });
    }
  } catch (ex) {
    next(ex);
  }
};

const login = async (req, res, next) => {
  try {
    const getExistingUser = await queryUserFromDb(req.body.email);

    if (getExistingUser.length < 1) {
      return res.status(401).json({
        message: config.get("userNotFound"),
      });
    } else {
      bcrypt.compare(
        req.body.password,
        getExistingUser[0].password,
        async (error, resp) => {
          if (error) {
            return res.status(401).json({
              message: config.get("InvalidPassword"),
            });
          }

          if (resp) {
            const Token = jwt.sign(
              {
                username: getExistingUser[0].name,
                email: getExistingUser[0].email,
                country: getExistingUser[0].country,
                phone: getExistingUser[0].phone,
              },
              config.get("AuthKey"),
              {
                expiresIn: "1h",
              }
            );

            return res.status(200).json({
              userId: getExistingUser[0]._id,
              username: getExistingUser[0].name,
              email: getExistingUser[0].email,
              country: getExistingUser[0].country,
              phone: getExistingUser[0].phone,
              token: Token,
            });
          }

          return res.status(401).json({
            message: config.get("InvalidAuth"),
          });
        }
      );
    }
  } catch (err) {
    next(err);
  }
};

const queryUserFromDb = async (user) => {
  try {
    const getUser = await appModel.find({ email: user });
    return getUser;
  } catch (ex) {
    return new Error(config.get("error"));
  }
};

const uploadFile = async (req, res, next) => {
  try {
    const Id = new mongoose.Types.ObjectId();
    const item = new itemModel({
      _id: Id,
      avatar: `${req.headers.host}/uploads/${req.file.originalname}`,
    });

    item
      .save()
      .then((result) => {
        res.status(201).json({
          message: config.get("fileUpload"),
          id: Id,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: config.get("error"),
          info: error.message,
        });
      });
  } catch (err) {
    next(err);
  }
};

const saveItem = async (req, res, next) => {
  try {
    const updateDocument = await itemModel.findByIdAndUpdate(
      req.body.Id,
      {
        $set: {
          title: req.body.title,
          mrp: req.body.mrp,
          ratings: req.body.ratings,
        },
      },
      { new: true }
    );

    res.status(200).json(updateDocument);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAppData,
  login,
  register,
  uploadFile,
  saveItem,
};
