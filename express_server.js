//Lighthouse Labs
//Week 3, Day 1
//TinyApp
//Anil Patel

const express = require("express");
const app = express();
const PORT = 8080; // default 

app.set("view engine", "ejs");

const urlDatabase = {
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

app.get("/urls", (req, res) => { //pass the URL data to our template urls_index.ejs in views folder
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars); //EJS looks inside views for extension .ejs
});