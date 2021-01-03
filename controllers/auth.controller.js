// import User model
const User = require("../models/user.model.js");

// imports
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const config = require("../config/config");

// controller for signin
const signin = async (req, res) => {
  // check if user account exists
  try {
    let user = await User.findOne({
      email: req.body.email,
    });
    if (!user)
      return res.status("401").json({
        error: "Account information not found",
      });

    if (!user.authenticate(req.body.password)) {
      return res.status("401").send({
        error: "Email and password don't match.",
      });
    }

    // create user token
    // and sign it
    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.jwtSecret
    );

    // set user token in cookie
    res.cookie("t", token, {
      expire: new Date() + 9999,
    });

    // return account information in json response
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status("401").json({
      error: "Could not sign in",
    });
  }
};

// sign user out of session
const signout = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({
    message: "signed out",
  });
};

// verify that the incoming request
// has a valid JWT in the Authorization header
// const requireSignin = expressJwt({
//   secret: config.jwtSecret,
//   userProperty: "auth",
//   algorithms: ["HS256"],
// });

// verify that the incoming request
// has a valid JWT in the Authorization header
// this function returns an error response
// for an individual route
function verifyRequest() {
  return [
    expressJwt({
      secret: config.jwtSecret,
      userProperty: "auth",
      algorithms: ["HS256"],
    }),
    function (err, req, res, next) {
      res.status(err.status).json(err);
    },
  ];
}

// check if user has auth to perfrom actions
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

// export controllers
module.exports = {
  signin,
  signout,
  verifyRequest,
  hasAuthorization,
};
