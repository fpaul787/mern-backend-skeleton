// our model
const User = require("../models/user.model.js");

// method that helps with javascript arrays
const { extend} = require("lodash");

const listUsers = async (req, res) => {
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
};

const createUser = async (req, res) => {
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
};

const userById = async (req, res, next, id) => {
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
};

const userAccountRead = async (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const userAccountUpdate = async (req, res) => {
  try {
    let user = req.profile;
    user = extend(user, req.body); // from lodash module. Merge changes from body into user
    user.updated = Date.now();

    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      error: getErrorMessage(error),
    });
  }
};

const userAccountDelete = async (req, res) => {
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
};

// exports
module.exports = {
  listUsers,
  createUser,
  userById,
  userAccountRead,
  userAccountUpdate,
  userAccountDelete,
};
