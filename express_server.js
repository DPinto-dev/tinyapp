const app = require("express")();
const PORT = 8080; // default port 8080
const ejs = require("ejs");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  IEzupB: { longURL: "http://example.com", userId: "ZxTQtT" }
};

const users = {
  // ZxTQtT: { userId: "ZxTQtT", email: "shakira@gmail.com", password: "1" }
};

// HELPER FUNCTIONS ----------------------------------------->
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

const isValidURL = string => {
  let res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

// Returns a user object
const getUserByEmail = inputEmail => {
  for (const user in users) {
    if (users[user].email === inputEmail) {
      return users[user];
    }
  }
  return false;
};

const urlsForUser = userId => {
  let filteredURLS = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userId === userId) {
      filteredURLS[url] = urlDatabase[url];
    }
  }
  return filteredURLS;
};
// ---------------------------------------------------------->

// HOME
app.get("/", (req, res) => {
  res.redirect("/login");
});

// TESTING ENDPOINTS ----------------------------------------->
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/users.json", (req, res) => {
  res.json(users);
});
// ---------------------------------------------------------->

// Main GET route: page displays all urls in the "database"
app.get("/urls", (req, res) => {
  // this is sending the urlDatabase object to the EJS template - it needs to be an object, even if it's a single variable, so that we can use its key to access the data within our template
  let user = req.cookies["user_id"];
  if (user) {
    const templateVars = {
      urlDatabase: urlsForUser(user),
      user: users[user]
    };
    res.render("urls_index", templateVars); // This refers to the template './views/urls_index.ejs'. By default EJS automatically looks into the views directory for .ejs files
  } else {
    res.redirect("/login");
  }
});

// AUTH VIEWS ------------------------------------------------>
// If user is auth => has a cookie => Render the page for adding a new URL
app.get("/urls/new", (req, res) => {
  let user = req.cookies["user_id"];
  if (user) {
    let templateVars = { user: users[user] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// New Account handler
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("users_register", templateVars);
});

// Receives login information and stores it in a cookie
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("users_login", templateVars);
});
// ---------------------------------------------------------->

// AUTH POST ------------------------------------------------>
// New Account creation handler
app.post("/register", (req, res) => {
  const newUserId = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (email === "" || getUserByEmail(email) || password === "") {
    console.log("failed");
    res.statusCode = 400;
    res.end(`400 Bad Request`);
  } else {
    console.log(password, "\n", hashedPassword);
    users[newUserId] = { userId: newUserId, email, password: hashedPassword };
    res.cookie("user_id", newUserId);
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  user = getUserByEmail(email);
  const passwordAuthenticated = bcrypt.compareSync(password, user.password);
  console.log(passwordAuthenticated);
  if (user) {
    if (passwordAuthenticated) {
      res.cookie("user_id", user.userId);
      res.redirect("/urls");
    } else {
      res.statusCode = 403;
      res.end("403 Forbidden");
    }
  } else {
    res.statusCode = 403;
    res.end("403 Forbidden");
  }
});
// ---------------------------------------------------------->

// Adds a new URL to the "database" (from urls_new.ejs)
app.post("/urls", (req, res) => {
  // Tests if we have a valid URL and redirects to a 404 if not
  // For now we are not rendering a specific page or doing client side validation for the URL
  if (!isValidURL(req.body.longURL)) {
    // ... WIP ...
  }

  // Adds a new entry to the database Generates a new shortURL and stores it in the object
  const newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = {
    longURL: req.body.longURL.trim(),
    userId: req.cookies["user_id"]
  };
  res.redirect(`/urls/${newShortUrl}`);
});

// Renders the page that display the requested shorted URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

// Edits an URL
app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const currentUser = req.cookies.user_id;
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

// Removes posted URL from "database".
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const currentUser = req.cookies.user_id;
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

// Redirects user to the longURL stored in our objects
app.get("/u/:shortURL", (req, res) => {
  res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
});

// "Logs out" the user by clearing the cookie file. It should be a POST route because we are changing the state of our application by logging out
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/error", (req, res) => {
  res.statusCode = 404;
  res.end(`404 Page Not Found`);
});

app.listen(PORT, () => {
  console.log(`TinyApp server is listening on port ${PORT}!`);
});
