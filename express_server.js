//Lighthouse Labs
//Week 3, Day 1
//TinyApp
//Anil Patel

const express = require("express");
const app = express();
const PORT = 8080; // default 

const bodyParser = require("body-parser"); //convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body. 
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = { //use JS to get long url from short url based on dabse 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {  //registers a handler on the root path, "/".
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => { //JSON string with entire urlDatabase object
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => { //HTML response code, rendered in client
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//can verify with curl -i http://localhost:8080/hello
// run from new terminal, with server up in other terminal

//tells browser what to do
app.get("/urls", (req, res) => { //pass the URL data to our template urls_index.ejs in views folder
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars); //EJS looks inside views for extension .ejs
});

app.get("/urls/new", (req, res) => { //route handler will render the page with the form; needs to be defined before below 
  res.render("urls_new");
});

//access urlDatabase object 
app.get("/urls/:shortURL", (req, res) => { //added : means what comes after is parameter (object where key is name, value is what user types in to browser)
  console.log(req.params.shortURL); //takes in what user puts in ie. http://localhost:8080/urls/helen
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }; // want JS to get two to match 
  res.render("urls_show", templateVars); //passed both urls into templateVars object 
});
