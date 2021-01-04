// imports
const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");
var path = require("path");
const expressJwt = require("express-jwt");
const config = require("../../config/config");


// our model
const User = require("../../models/user.model.js");
// method that helps with javascript arrays
const { extend, fromPairs } = require("lodash");
// utility that helps with error handling
const getErrorMessage = require("../../helpers/dbErrorHandler");
// controller for auth sign in
const {

  hasAuthorization,
} = require("../../controllers/auth.controller");

const defaultPhoto = async (req, res) => {
  return res.sendFile(
    path.join(__dirname, "../../client/src/assets/", "profile-pic.png")
  );
};

// @route GET api/users
// @desc  Get users
// @access Public
router.get("/", async (req, res) => {
  // res.send('Get Users');
  try {
    let users = await User.find().select([
      "name",
      "email",
      "updated",
      "created",
    ]);
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
});

router.get(
  "/photo/:userId",
  async (req, res, next) => {
    if (req.profile.photo.data) {
      res.set("Content-Type", req.profile.photo.contentType);
      return res.send(req.profile.photo.data);
    }
    next();
  },
  defaultPhoto
);

router.get("/defaultphoto", defaultPhoto);

// @route POST api/users
// @desc  Create a user
// @access Public
router.post("/", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
});

// @route PARAM userId
// @desc  Called when param is passed
// @access Public
router.param("userId", async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve user",
    });
  }
});

const verifyRequest = expressJwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"],
});

// @route GET /api/users/:userId
// @desc  Get a user profile
// @access Private, requires sign in
router.get("/:userId", verifyRequest, async (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
});

// @route PUT /api/users/:userId
// @desc  Update a user profile
// @access Private, requires sign in and authorization
router.put(
  "/:userId",
  verifyRequest,
  hasAuthorization,
  async (req, res) => {
    // formidable will allow the
    // server to read the multipart
    // form data and give us access
    // to the fields and the file
    // let form = new formidable.IncomingForm();
    // form.keepExtensions = true;
    // form.parse(req, async (err, fields, files) => {
      
    // });

    try {
      let user = req.profile;
      user = extend(user, req.body); // from lodash module. Merge changes from body into user
      user.updated = Date.now();


      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (error) {
      console.log(error.message)
      return res.status(400).json({
        error: getErrorMessage(error),
      });
    }
  }
);

// @route DELETE /api/users/:userId
// @desc  Delete a user profile
// @access Private, requires sign in and authorization
router.delete(
  "/:userId",
  verifyRequest,
  hasAuthorization,
  async (req, res) => {
    try {
      let user = req.profile;
      let deletedUser = await user.remove();
      deletedUser.hashed_password = undefined;
      deletedUser.salt = undefined;
      res.json(deletedUser);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  }
);

module.exports = router;
