const express = require('express');

const app = express();
const port = 8080;

app.set("view engine", "ejs");

const generateRandomString = function () {

  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5).toUpperCase();

}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase};
  res.render("urls_index",templateVars )
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL:  req.params.longURL};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
   let shortURL = generateRandomString();
   urlDatabase[shortURL] = req.body.longURL;
   res.redirect(`/u/${shortURL}`);
   console.log(urlDatabase)
  });

app.delete('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});