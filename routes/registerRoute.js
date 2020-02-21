const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const {
  getUserByEmail,
  generateRandomString
} = require("../helpers/_helpers.js");

// New Account handler
router.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("users_register", templateVars);
});

// New Account creation handler
router.post("/register", (req, res) => {
  const newUserId = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (email === "" || getUserByEmail(email, users) || password === "") {
    console.log("failed");
    res.statusCode = 400;
    res.end(`400 Bad Request`);
  } else {
    console.log(password, "\n", hashedPassword);
    users[newUserId] = { userId: newUserId, email, password: hashedPassword };
    req.session.user_id = newUserId; //Sets a secure cookie
    // res.cookie("user_id", newUserId);
    res.redirect("/urls");
  }
});

module.exports = router;
