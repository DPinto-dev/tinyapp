const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../database/usersDB");
const urlDatabase = require("../database/urlsDB");

const {
  getUserByEmail,
  generateRandomString,
  isUserLoggedIn
} = require("../helpers/_helpers.js");

// New Account handler
router.get("/", (req, res) => {
  const currentUser = req.session.user_id;
  if (isUserLoggedIn(currentUser, users)) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      urls: urlDatabase,
      user: users[req.session.user_id]
    };
    res.render("../views/users_register", templateVars);
  }
});

// New Account creation handler
router.post("/", (req, res) => {
  const newUserId = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Adds a new user to the DB if email is not in the DB and email and password are not ""
  if (getUserByEmail(email, users) || email === "" || password === "") {
    res.statusCode = 400;
    res.end(`400 Bad Request`);
  } else {
    users[newUserId] = { userId: newUserId, email, password: hashedPassword };
    req.session.user_id = newUserId; //Sets a secure cookie
    res.redirect("/urls");
  }
});

module.exports = router;
