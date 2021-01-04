// imports
const express = require("express");
var path = require("path");

// express router
const router = express.Router();

const defaultPhoto = async (req, res) => {
  return res.sendFile(path.join(__dirname, "../../assets/", "profile-pic.png"));
};

// @route GET api/assets/defaultphoto
// @desc  Get a default photo
// @access Public
router.get('/defaultphoto', defaultPhoto)

module.exports = router;
