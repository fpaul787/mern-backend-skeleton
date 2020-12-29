const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { extend } = require('lodash');
const getErrorMessage = require('../../helpers/dbErrorHandler');
const { requireSignin, hasAuthorization } = require('../../controllers/auth.controller');

// @route GET api/users
// @desc  Get users
// @access Public
router.get('/', async (req, res) => {
    // res.send('Get Users');
    try {
        let users = await User.find().select(["name", "email", "updated", "created"]);
        res.json(users);
    } catch (err) {
        return res.status(400).json({
            error: getErrorMessage(err),
        });
    }
});

// @route POST api/users
// @desc  Create a user
// @access Public
router.post('/', async (req, res) => {
    // res.send('Create user route');
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

// @route GET /api/users/:userId
// @desc  Get a user profile
// @access Private, requires sign in
router.get('/:userId', requireSignin, async (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
});

// @route PUT /api/users/:userId
// @desc  Update a user profile
// @access Private, requires sign in and authorization
router.put('/:userId', requireSignin, hasAuthorization, async (req, res) => {
    try {
        let user = req.profile;
        user = extend(user, req.body); // from lodash module. Merge changes from body into user
        user.updated = Date.now();
        await user.save();
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    } catch (err) {
        return res.status(400).json({
            error: getErrorMessage(err),
        });
    }
});


// @route DELETE /api/users/:userId
// @desc  Delete a user profile
// @access Private, requires sign in and authorization
router.delete('/:userId', requireSignin, hasAuthorization, async (req, res) => {
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
});
module.exports = router;