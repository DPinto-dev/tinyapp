const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const ejs = require("ejs");
const methodOverride = require("method-override");

// The method override has to go after body-parser

const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const urlDatabase = require("./database/urlsDB");
const users = require("./database/usersDB");

app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);
app.use(methodOverride("_method"));
// app.use(
//   methodOverride(function(req, res) {
//     if (req.body && typeof req.body === "object" && "_method" in req.body) {
//       // look in urlencoded POST bodies and delete it
//       var method = req.body._method;
//       delete req.body._method;
//       return method;
//     }
//   })
// );

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

// ----------------------------------------------------------

// HELPER FUNCTIONS -----------------------------------------
const getUserByEmail = require("./helpers/getUserByEmail");
const generateRandomString = require("./helpers/generateRandomString");
const urlsForUser = require("./helpers/urlsForUser");
// ----------------------------------------------------------

// HOME;
app.get("/", (req, res) => {
  // If the user is logged in...
  let user = req.session.user_id;
  if (user) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// TESTING ENDPOINTS ----------------------------------------->
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
// ----------------------------------------------------------

// STAR
app.get("/*", (req, res) => {
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`TinyApp server is listening on port ${PORT}!`);
});
