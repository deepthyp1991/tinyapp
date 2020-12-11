const {generateRandomString, addUser, emailExist, urlsForUser, userByEmail} = require('./helpers');
const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookies = require('cookie-parser');
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookies());
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}))

//URLs db
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "890uyt"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "iut675"}
};

// User  database
const users = {
  "890uyt": {
    id: "890uyt",
    email: "user1@example.com",
    password: bcrypt.hashSync("qwer", 10)
  },
  "iut675": {
    id: "iut675",
    email: "user2@example.com",
    password:  bcrypt.hashSync("df456", 10)
  }
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/", (req,res) => {
  const templateVars = { user: users[req.session.userID]};
  res.render("index",templateVars)
})

//Showing all the URLS
app.get("/urls", (req, res) => {
  const templateVars = {user: users[req.session.userID], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//creating the new URL
app.get("/urls/new", (req, res) => {
  if (!req.session.userID) {
    res.redirect("/login");
  } else {
    const templateVars = { user: users[req.session.userID]};
    res.render("urls_new",templateVars);
  }
});
//Show a specific URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: users[req.session.userID], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], userID:  urlDatabase[req.params.shortURL]['userID']  };
  res.render("urls_show", templateVars);
});

//Register Form
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.userID]};
  res.render("urls_register", templateVars);
});

//Login page
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.session.userID]};
  res.render("urls_login", templateVars);
});

//Create new URL
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = {'longURL': longURL, 'userID': req.session.userID};
  res.redirect('/urls');
});

//access a Url for the key
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!Object.prototype.hasOwnProperty.call(urlDatabase,shortURL)) {
    res.status(404);
    res.send("404 NOT FOUND");
  } else {
    const longURL = urlDatabase[shortURL]['longURL'];
    res.redirect(longURL);
  }
});

//delete a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.userID;
  const shortURL = req.params.shortURL;
  const URLs = urlsForUser(id);
  if (URLs.includes(shortURL)) {
    delete urlDatabase[shortURL];
    res.redirect('/urls/');
  } else {
    res.status(403);
    res.send('<h2>Don\'t have the permission to delete this<h2>');
  }
});
//update a URL
app.post("/urls/:shortURL/Update", (req, res) => {
  const id = req.session.userID;
  const shortURL = req.params.shortURL;
  const URLs = urlsForUser(id);
  if (URLs.includes(shortURL)) {
    urlDatabase[shortURL] = {longURL: req.body.longURL, userID: id};
    res.redirect('/urls/');
  } else {
    res.status(403);
    res.send('<h2>You don\'t have the permission to update this URL<h2>');
  }
});
//Login
app.post("/login", (req, res) => {
  let password = req.body.password;
  let user = userByEmail(users,req.body.email);
  if (!emailExist(users,req.body.email) || !bcrypt.compare(user.password, password)) {
    res.status(403);
    res.send("<h2> Email Doesn't exist or wrong password</h2>");
  } else if (user.email === req.body.email && bcrypt.compare(user.password, password)) {
    req.session.userID = user.id;
    res.redirect('/urls');
  }
});
//logout by clearing the cookies
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//Regaister a new user
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  if (email === "" || password === "" || emailExist(users, email)) {
    res.status(404);
    res.send("404 NOT FOUND");  
  } else {
    addUser(users, id, email, password);
    req.session.userID = id;
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});