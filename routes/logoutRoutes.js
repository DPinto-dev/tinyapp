// IMPORTS --------------------------------------------------
const express = require("express");
const router = express.Router();

// POST /logout ---------------------------------------------
// Changes the state of the app by setting the cookie to null.
router.post("/", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

module.exports = router;
