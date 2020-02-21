// IMPORTS --------------------------------------------------
const express = require("express");
const router = express.Router();
const urlDatabase = require("../database/urlsDB");

// GET /u/:shortURL  ----------------------------------------
// Redirects user to the longURL stored in database. Available to all users.
router.get("/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
  } else {
    res.statusCode = 404;
    res.end("404 - URL Not Found.");
  }
});

module.exports = router;
