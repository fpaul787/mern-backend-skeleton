// imports
const express = require("express");
const router = express.Router();


// our model
const User = require("../../models/user.model.js");

// utility that helps with error handling
const getErrorMessage = require("../../helpers/dbErrorHandler");

// controller for auth sign in
const {
  verifyRequest,
  hasAuthorization,
} = require("../../controllers/auth.controller");

// controller for user
const {
  listUsers,
  createUser,
  userById,
  userAccountRead,
  userAccountUpdate,
  userAccountDelete,
} = require("../../controllers/user.controller");

// @route GET api/users
// @desc  Get users
// @access Public
router.get("/", listUsers);

// @route POST api/users
// @desc  Create a user
// @access Public
router.post("/", createUser);

// @route PARAM userId
// @desc  Called when param is passed
// @access Public
router.param("userId", userById);

// @route GET /api/users/:userId
// @desc  Get a user profile
// @access Private, requires sign in
router.get("/:userId", verifyRequest, userAccountRead);

// @route PUT /api/users/:userId
// @desc  Update a user profile
// @access Private, requires sign in and authorization
router.put("/:userId", verifyRequest, hasAuthorization, userAccountUpdate);

// @route DELETE /api/users/:userId
// @desc  Delete a user profile
// @access Private, requires sign in and authorization
router.delete("/:userId", verifyRequest, hasAuthorization, userAccountDelete);

module.exports = router;
