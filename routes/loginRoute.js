const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { getUserByEmail } = require("../helpers/_helpers.js");

// Receives login information and stores it in a cookie
router.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("users_login", templateVars);
});
// ---------------------------------------------------------->

// AUTH POST ------------------------------------------------>

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  user = getUserByEmail(email, users);
  const passwordAuthenticated = bcrypt.compareSync(password, user.password);
  console.log(passwordAuthenticated);
  if (user) {
    if (passwordAuthenticated) {
      req.session.user_id = user.userId;
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
