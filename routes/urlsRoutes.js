// IMPORTS --------------------------------------------------
const express = require("express");
const router = express.Router();
const users = require("../database/usersDB");
const urlDatabase = require("../database/urlsDB");
const {
  generateRandomString,
  urlsForUser,
  isUserLoggedIn
} = require("../helpers/_helpers.js");

// GET /urls ------------------------------------------------
// Main GET route; Displays all urls in the database for a particular owner
router.get("/", (req, res) => {
  const currentUser = req.session.user_id;
  const filteredUrls = urlsForUser(currentUser, urlDatabase);
  const creationDate = filteredUrls.creationDate;
  if (isUserLoggedIn(currentUser, users)) {
    const templateVars = {
      urlDatabase: filteredUrls,
      user: users[currentUser],
      creationDate
    };
    res.render("urls_index", templateVars);
  } else {
    res.statusCode = 403;
    res.render("errors_view", {
      errorMsg: "403 - Forbidden.\nPlease login first.",
      user: null
    });
  }
});

// GET /urls/new --------------------------------------------
// Renders page for adding a new URL to DB if user is authed
router.get("/new", (req, res) => {
  const currentUser = req.session.user_id;

  if (isUserLoggedIn(currentUser, users)) {
    let templateVars = { user: users[currentUser] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// POST /urls -----------------------------------------------
// Adds a new URL to the database with an id (shortURL)
router.post("/", (req, res) => {
  // Creates new shortURL
  const newShortUrl = generateRandomString();

  // Saves the date/time
  const creationDate = new Date(Date.now()).toDateString();

  // Inserts new URL in database
  urlDatabase[newShortUrl] = {
    longURL: req.body.longURL.trim(),
    userId: req.session.user_id,
    creationDate,
    visitCount: 0,
    uniqueVisitsCount: []
  };
  res.redirect(`/urls/${newShortUrl}`);
});

// GET /urls/:shortURL --------------------------------------
// Renders page that display shortURL and option to edit it
router.get("/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const currentUser = req.session.user_id;
  const urlOwner = urlDatabase[shortURL].userId;

  // Makes sure only the owner can VIEW the URL edit page:
  if (urlOwner !== currentUser) {
    res.statusCode = 403;
    res.render("errors_view", {
      errorMsg: "403 Forbidden - You cannot alter that URL",
      user: null
    });
  } else {
    // If the user is logged in...
    if (isUserLoggedIn(currentUser, users)) {
      // If the shortURL is in the DB
      if (urlDatabase[req.params.shortURL]) {
        const templateVars = {
          shortURL: req.params.shortURL,
          longURL: urlDatabase[req.params.shortURL].longURL,
          user: users[currentUser]
        };
        res.render("urls_show", templateVars);
      } else {
        res.statusCode = 404;
        res.render("errors_view", {
          errorMsg: "404 - Short URL Not Found",
          user: null
        });
      }
    } else {
      // User not logged in
      res.statusCode = 403;
      res.render("errors_view", {
        errorMsg: "403 - Forbidden.\nPlease login first.",
        user: null
      });
    }
  }
});

// PUT /urls/:shortURL -------------------------------------------
// Method Override. Updates the longURL of a shortURL in the database
router.put("/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const currentUser = req.session.user_id;
  const urlOwner = urlDatabase[shortURL].userId;

  // Only the owner can edit the URL:
  if (urlOwner === currentUser) {
    urlDatabase[shortURL] = { longURL: req.body.longURL, userId: currentUser };
    res.redirect("/urls");
  } else {
    res.statusCode = 403;
    res.render("errors_view", {
      errorMsg: "403 Forbidden - You cannot alter that URL",
      user: null
    });
  }
});

// DELETE /urls/:shortURL ----------------------------------------
// Method Override.
router.delete("/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const currentUser = req.session.user_id;
  const urlOwner = urlDatabase[shortURL].userId;

  // Only the owner can delete URLs:
  if (urlOwner === currentUser) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.statusCode = 403;
    res.render("errors_view", {
      errorMsg: "403 Forbidden - You cannot alter that URL",
      user: null
    });
  }
});

module.exports = router;
