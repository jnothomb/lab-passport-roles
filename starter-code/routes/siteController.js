"use strict";

const express = require("express");
const siteController = express.Router();


//-- INDEX PAGE --//
siteController.get("/", (req, res, next) => {
  res.render("index");
});


//-- USER MODEL --//
const User = require("../models/user");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");


//-- PRIVATE PAGE RENDER --//

siteController.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", {
    user: req.user
  });
});


//-- ROUTE VIEWS SETUPS --//

//SIGN UP

siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup.ejs");
});

siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("views/auth/signup.ejs", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("views/auth/signup.ejs", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("views/auth/signup.ejs", {
          message: "Something went wrong"
        });
      } else {
        res.redirect("/registered");
      }
    });
  });
});



// LOGIN
siteController.get("/login", (req, res, next) => {
  res.render("auth/login");
});


siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/welcome",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


// RENDER WELCOME PAGE
siteController.get("/welcome", (req, res, next) => {
  res.render("auth/welcome.ejs");
});

// RENDER REGISTERED PAGE
siteController.get("/registered", (req, res, next) => {
  res.render("auth/registered.ejs");
});

// RENDER LOGIN PAGE on LOGOUT FUNCTION
siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


// EXPORT MODULES
module.exports = siteController;
