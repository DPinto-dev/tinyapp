// IMPORTS --------------------------------------------------
const express = require("express");
const router = express.Router();
const urlDatabase = require("../database/urlsDB");

// GET /u/:shortURL  ----------------------------------------
// Redirects user to the longURL stored in database. Available to all users.
router.get("/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    // Keeps track of the total number of visits
    const URL = urlDatabase[req.params.shortURL];
    URL.visitCount += 1;

    // To keep track of unique visitors, only add user_id if not in DB yet
    const currentUser = req.session.user_id;
    if (!URL.uniqueVisitsCount.includes(currentUser)) {
      URL.uniqueVisitsCount.push(currentUser);
    }

    //  YC5ZN5:
    //   { longURL: 'http://www.lighthouselabs.ca',
    //     userId: 'hQBXRa',
    //     creationDate: 'Sat Feb 22 2020',
    //     visitCount: 0,
    //     uniqueVisitsCount: [] } }
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
