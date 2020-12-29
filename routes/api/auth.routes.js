const express = require('express');
const { signin, signout } = require('../../controllers/auth.controller');
const router = express.Router();

// @route GET api/auth/signin
// @desc  Sign in route
// @access Public
router.post('/signin', signin);

// @route GET api/auth/signout
// @desc  Sign out route
// @access Private
router.get('/signout', signout);

module.exports = router;