const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { getUserByEmail } = require("../helpers/_helpers.js");

const users = require("../database/usersDB");

// Receives login information and stores it in a cookie
router.get("/", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("users_login", templateVars);
});
// ---------------------------------------------------------->

// AUTH POST ------------------------------------------------>

router.post("/", (req, res) => {
  const { email, password } = req.body;
  user = getUserByEmail(email, users);

  if (user) {
    const passwordAuthenticated = bcrypt.compareSync(
      password,
      users[user].password
    );
    if (passwordAuthenticated) {
      req.session.user_id = users[user].userId;
      res.redirect("/urls");
    } else {
      res.statusCode = 403;
      res.end("403 Forbidden");
    }
  } else {
    res.statusCode = 403;
    res.end("403 Forbidden");
  }
});

module.exports = router;
