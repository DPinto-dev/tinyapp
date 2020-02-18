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

// function isValidURL(string) {
//   var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
//   return (res !== null)
// };

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase }; // this is sending the urlDatabase object to the EJS template - it needs to be an object, even if it's a single variable, so that we can use its key to access the data within our template
  res.render("urls_index", templateVars); // This refers to the template './views/urls_index.ejs'. By default EJS automatically looks into the views directory for .ejs files
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // Generates a new shortURL and stores it in the object
  const newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect(`/urls/${newShortUrl}`);
  // res.send(`${req.body.longURL} was saved as ${newShortUrl}`);
});

app.get("/urls/:shortURL", (req, res) => {
  // test with object shorthand notation
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

// Redirects user to the longURL stored in our objects
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
