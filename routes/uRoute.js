const express = require("express");
const router = express.Router();

// Redirects user to the longURL stored in our objects
router.get("/u/:shortURL", (req, res) => {
  res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
});

module.exports = router;
