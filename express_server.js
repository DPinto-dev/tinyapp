const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const ejs = require("ejs");

const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
app.set("view engine", "ejs");

// ROUTES ---------------------------------------------------
const urlsRoutes = require("./routes/urlsRoute"),
  uRoutes = require("./routes/uRoute"),
  registerRoutes = require("./routes/registerRoute"),
  loginRoutes = require("./routes/loginRoute"),
  logoutRoutes = require("./routes/logoutRoute");

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

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);

const urlDatabase = {
  IEzupB: { longURL: "http://example.com", userId: "ZxTQtT" }
};

const users = {
  // ZxTQtT: { userId: "ZxTQtT", email: "shakira@gmail.com", password: "1" }
};

const isValidURL = string => {
  let res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

// HOME
app.get("/", (req, res) => {
  res.redirect("/login");
});

// STAR
// app.get("/*", (req, res) => {
//   res.redirect("/login");
// });

app.get("/error", (req, res) => {
  res.statusCode = 404;
  res.end(`404 Page Not Found`);
});

// TESTING ENDPOINTS ----------------------------------------->
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/users.json", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`TinyApp server is listening on port ${PORT}!`);
});
