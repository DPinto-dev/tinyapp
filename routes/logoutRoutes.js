const express = require("express");
const router = express.Router();

// "Logs out" the user by clearing the cookie file. It should be a POST route because we are changing the state of our application by logging out
router.post("/", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

module.exports = router;
