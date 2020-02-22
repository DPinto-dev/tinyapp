// IMPORTS --------------------------------------------------
const express = require("express");
const router = express.Router();
const urlDatabase = require("../database/urlsDB");

// GET /u/:shortURL  ----------------------------------------
// Redirects user to the longURL stored in database. Available to all users.
router.get("/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    // Keeps track of the total number of visits
    const currentUser = req.session.user_id;
    const URL = urlDatabase[req.params.shortURL];
    URL.visitCount += 1;

    // Also track every user and time when shortUrl was accessed
    const timestamp = new Date(Date.now());
    URL.timestamp.push({ timestamp, currentUser });

    // To keep track of unique visitors, only add user_id if not in DB yet
    if (!URL.uniqueVisitsCount.includes(currentUser)) {
      URL.uniqueVisitsCount.push(currentUser);
    }
    // Then do the redirect
    res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
  } else {
    res.statusCode = 404;
    res.render("errors_view", {
      errorMsg: "404 - URL Not Found",
      user: null
    });
  }
});

module.exports = router;
