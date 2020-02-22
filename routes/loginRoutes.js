// IMPORTS --------------------------------------------------
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getUserByEmail, isUserLoggedIn } = require("../helpers/_helpers.js");
const users = require("../database/usersDB");

// GET /login -----------------------------------------------
router.get("/", (req, res) => {
  const currentUser = req.session.user_id;
  if (isUserLoggedIn(currentUser, users)) {
    res.redirect("/urls");
  }
  const templateVars = { user: users[currentUser] };
  res.render("users_login", templateVars);
});

// AUTH POST ------------------------------------------------
router.post("/", (req, res) => {
  const { email, password } = req.body;
  currentUser = getUserByEmail(email, users);

  if (currentUser) {
    const passwordAuthenticated = bcrypt.compareSync(
      password,
      users[currentUser].password
    );
    if (passwordAuthenticated) {
      req.session.user_id = users[currentUser].userId;
      res.redirect("/urls");
    } else {
      res.statusCode = 403;
      res.render("errors_view", {
        errorMsg: "Incorrect Email or Password (403)",
        user: null
      });
    }
  } else {
    res.statusCode = 403;
    res.render("errors_view", {
      errorMsg: "403 Forbidden",
      user: null
    });
  }
});

module.exports = router;
