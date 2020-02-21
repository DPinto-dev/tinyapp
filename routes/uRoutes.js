const express = require("express");
const router = express.Router();
const urlDatabase = require("../database/urlsDB");

// Redirects user to the longURL stored in our objects
router.get("/:shortURL", (req, res) => {
  res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
});

module.exports = router;
