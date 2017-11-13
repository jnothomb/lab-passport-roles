"use strict";

const express = require('express');
const siteController = express.Router();

/* GET home page. */
siteController.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("index", {
      title: "Express",
      loggedIn: true
    });
  } else {
    res.render("index", {
      title: "Express",
      loggedIn: false
    });
  }
});

module.exports = siteController;
