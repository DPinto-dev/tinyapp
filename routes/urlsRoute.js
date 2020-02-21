const express = require("express");
const router = express.Router();

// Helper Functions
const { generateRandomString, urlsForUser } = require("../helpers/_helpers.js");

// Main GET route; Displays all urls in the "database"
router.get("/urls", (req, res) => {
  // this is sending the urlDatabase object to the EJS template - it needs to be an object, even if it's a single variable, so that we can use its key to access the data within our template
  let user = req.session.user_id;
  if (user) {
    const templateVars = {
      urlDatabase: urlsForUser(user, urlDatabase),
      user: users[user]
    };
    res.render("urls_index", templateVars); // This refers to the template './views/urls_index.ejs'. By default EJS automatically looks into the views directory for .ejs files
  } else {
    res.redirect("/login");
  }
});

// If user is auth => has a cookie =>
// Renders page for adding a new URL to DB
router.get("/urls/new", (req, res) => {
  let user = req.session.user_id;
  if (user) {
    let templateVars = { user: users[user] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// Adds a new URL to the "database" (from urls_new.ejs)
router.post("/urls", (req, res) => {
  // Tests if we have a valid URL and redirects to a 404 if not
  // For now we are not rendering a specific page or doing client side validation for the URL
  if (!isValidURL(req.body.longURL)) {
    // ... WIP ...
  }

  // Adds a new entry to the database Generates a new shortURL and stores it in the object
  const newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = {
    longURL: req.body.longURL.trim(),
    userId: req.session.user_id
  };
  res.redirect(`/urls/${newShortUrl}`);
});

// Renders the page that display the requested shorted URL
router.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

// Route for updating the longURL of a shortURL in the database
router.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const currentUser = req.session.user_id;
  const urlOwner = urlDatabase[shortURL].userId;

  // Only the owner can edit the URL:
  if (urlOwner === currentUser) {
    urlDatabase[shortURL] = { longURL: req.body.longURL, userId: currentUser };
    res.redirect("/urls");
  } else {
    res.statusCode = 403;
    res.end("403 Forbidden - You cannot alter that URL");
  }

  // Tests if we have a valid URL and redirects to a 404 if not
  if (!isValidURL(req.body.longURL)) {
    // ... WIP ...
  }
});

// Removes URL from DB
router.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const currentUser = req.session.user_id;
  const urlOwner = urlDatabase[shortURL].userId;

  // Only the owner can delete URLs:
  if (urlOwner === currentUser) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.statusCode = 403;
    res.end("403 Forbidden - You cannot alter that URL");
  }
});

module.exports = router;
