const app = require("express")();
const PORT = 8080; // default port 8080
const ejs = require("ejs");
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Generate a string of 6 random alphanumeric characters
const generateRandomString = () => {
  const alphaNum =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let returnString = "";
  for (let i = 0; i < 6; i++) {
    returnString += alphaNum[Math.floor(Math.random() * alphaNum.length)];
  }
  return returnString;
};

function isValidURL(string) {
  let res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
}

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Main GET route: page displays all urls in the "database"
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase }; // this is sending the urlDatabase object to the EJS template - it needs to be an object, even if it's a single variable, so that we can use its key to access the data within our template
  res.render("urls_index", templateVars); // This refers to the template './views/urls_index.ejs'. By default EJS automatically looks into the views directory for .ejs files
});

// Render the page for adding a new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Handles the POST request (from urls_new.ejs) that adds a new URL to the "database"
app.post("/urls", (req, res) => {
  // Tests if we have a valid URL and redirects to a 404 if not
  // For now we are not rendering a specific page or doing client side validation for the URL
  let errorMsg;
  if (!isValidURL(req.body.longURL)) {
    // ... WIP ...
  }

  // Generates a new shortURL and stores it in the object
  const newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect(`/urls/${newShortUrl}`);
});

// Renders the page that display the requested shorted URL
app.get("/urls/:shortURL", (req, res) => {
  // test with object shorthand notation
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

// Removes posted URL from "database"
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// Handles updates to the "database". Receives longURL from urls_show.ejs
app.post("/urls/:shortURL", (req, res) => {
  // Tests if we have a valid URL and redirects to a 404 if not
  if (!isValidURL(req.body.longURL)) {
    // ... WIP ...
  }
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

// Redirects user to the longURL stored in our objects
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.post("/login", (req, res) => {
  console.log(req.body.username);
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.get("/error", (req, res) => {
  res.statusCode = 404;
  res.end(`404 Page Not Found`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
