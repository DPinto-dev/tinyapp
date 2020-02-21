// IMPORTS --------------------------------------------------
const express = require("express");
const ejs = require("ejs");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const urlDatabase = require("./database/urlsDB");
const users = require("./database/usersDB");
const { isUserLoggedIn } = require("./helpers/_helpers.js");

// SET UP ---------------------------------------------------
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

// MIDDLEWARE -----------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: [
      "fzUSwHnn9QsiNxinOplaD5tI6bxRyMNraKEX4rIN",
      "epL7nF21VrHVI6zgOpFBic0JPo07YGx2AdhUUiie"
    ]
  })
);
app.use(methodOverride("_method"));

// ROUTES ---------------------------------------------------
const urlsRoutes = require("./routes/urlsRoutes"),
  uRoutes = require("./routes/uRoutes"),
  registerRoutes = require("./routes/registerRoutes"),
  loginRoutes = require("./routes/loginRoutes"),
  logoutRoutes = require("./routes/logoutRoutes");

app.use("/urls", urlsRoutes);
app.use("/u", uRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);

// BASIC ROUTES: --------------------------------------------
// HOME -----------------------------------------------------
app.get("/", (req, res) => {
  // If the user is logged in...
  let currentUser = req.session.user_id;
  if (isUserLoggedIn(currentUser, users)) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// TESTING ENDPOINTS ----------------------------------------
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/users.json", (req, res) => {
  res.json(users);
});
app.get("/error", (req, res) => {
  res.statusCode = 404;
  res.end(`404 Page Not Found`);
});

// STAR -----------------------------------------------------
app.get("/*", (req, res) => {
  res.redirect("/login");
});

// SERVER INIT ----------------------------------------------
app.listen(PORT, () => {
  console.log(`TinyApp server is listening on port ${PORT}!`);
});
