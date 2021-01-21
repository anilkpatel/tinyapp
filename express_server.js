//Lighthouse Labs
//Week 3, Day 1
//TinyApp
//Anil Patel

const { emailExists, passwordMatching } = require("./helpers/userHelpers.js");
//const { emailExists, passwordMatching } = require('./helpers/userHelpers')

const express = require("express");
const app = express();
const PORT = 8080; // default 

const bodyParser = require("body-parser"); //convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body. 
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString() {
  let randomUrl = ""; //assign new value to variable, must be let 
  const universal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    randomUrl += universal.charAt(Math.floor(Math.random() * universal.length));
  return randomUrl;
};

//console.log(generateRandomString()); 

const urlDatabase = { //use JS to get long url from short url based on dabse 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//Create GET /login endpoint responds with login form template
app.get("/login", (req, res) => {
  const templateVars = { username: null }; // Pass object to templetes via templateVars 
  res.render("login", templateVars); //local varibale
  //ONLY redirect on POST reqs
});

//store user dbase
//all Get or POST the user req
//find ID objects, grab it, use [], store in TemplateVars under User



//User Registration Form
//GET /register endpoint for Registration Page 

app.get("/register", (req, res) => {  //returns registration template on the root path, "/".
  const templateVars = { username: null }; // Pass object to templetes via templateVars 
  res.render("register", templateVars); //local varibale
  //console.log();
});

//Registering New Users
//POST / register, to allow authentification / registration 
app.post("/register", (req, res) => { //add new user obj to new user dbase
  const {email} = req.body // destructuring 
  const {password} = req.body

  console.log("here", emailExists(users, email), users[email], email);
  if(!emailExists(users,email) && password.length) { //Modify POST /register endpoint for erros:
    //register
    const userID = generateRandomString();
  //reg form in body of req, save into user object
  //user ID is key
    users[userID] = {
     id: userID, 
     email, 
     password
    } 
  res.cookie('user_id', userID);
  console.log(users); //round brackets
  res.redirect("/urls");
  } else {
    // send 400
    const errors = []
    if(!password.length) errors.push('password length is 0')
    else errors.push('email exists')
    res.status(400).json({ errors: errors.join(', ') })
  }
});

//Passing the user Object to the _header, find endpoints for templates, define template Vars there to render 
app.get("user_id", (req, res) => { //look up user object in users object using user_idadded : means what comes after is parameter (object where key is name, value is what user types in to browser)
  //console.log(); //
  const templateVars = { username: users[userID] }; // Pass object to templetes via templateVars 
  //console.log();
  res.render("_header", templateVars); //passed both urls into templateVars object 
});

app.get("/", (req, res) => {  //registers a handler on the root path, "/".
  res.send("Hello!");
  res.cookie['username'];
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

//tells browser what to do // URL LIST (can go thru browser or the redirect)
app.get("/urls", (req, res) => { //pass the URL data to our template urls_index.ejs in views folder
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] }; //pass user name to index, and can see header
  console.log(templateVars);
  res.render("urls_index", templateVars); //EJS looks inside views for extension .ejs
});

app.get("/urls/new", (req, res) => { //route handler will render the page with the form; needs to be defined before below 
  const templateVars = {username: req.cookies["username"]}; 
  res.render("urls_new", templateVars); //local varibale 
});

app.get("/u/:shortURL", (req, res) => { //GRAB longURL from short, use key value pairs 
  const shortUrl = req.params.shortURL; //not body, but params cause getting from url
  const templateVars = {longURL: urlDatabase[shortUrl], username: req.cookies["username"]}; 
  res.redirect(templateVars); //sending in response, pass in template with data
});


///ERROR: Need to change username to user, read cookie, get userID from cookie, 
//look up userID in database, if locate pass into templateVars
//update for all pages using _header.ejs



//LOGIN ROUTE: Add endpoint to handle a POST to /login in your Express server
//set a cookie named username
//do a redirect after call 
app.post('/login', (req, res) => { // post req with body
  const userName = req.body.username; 
  //console.log(username); 
  res.cookie('username', userName) //set the cookie using key value pair; client gives username,  
  const templateVars = {username: req.cookies["username"]}; 
  res.redirect('/urls'); //redirect back to list of URLs. Can't be longURL cause redirect to whatever put in
});
////CHANGE ABOVE: Post Log in End Point, using email and password to verify user
///if find, set cookie, not username but userID, everywhere use cookie change to userID
//Cookie parser??


//LOGOUT ROUTE: Add endpoint to handle a POST to /login in your Express server
//clear the cookie named username
//do a redirect after call 
app.post('/logout', (req, res) => { // post req with body
  const userName = req.body.username; 
  //console.log(username); 
  res.clearCookie('username', userName) //set the cookie using key value pair; client gives username,  
  res.redirect('/urls'); //redirect back to list of URLs. Can't be longURL cause redirect to whatever put in
});

app.post ("/urls/:id", (req, res) => { //must match to front end urls_show, but back end noation for path
  const shortURL = req.params.id //request info from web site address, line 73 calls the web page
  const longURL = req.body.longURL //info from front end input
  console.log("start>>>>>>>>>>", longURL);
  urlDatabase[shortURL] = longURL //object with key = longURL
  res.redirect("/urls");  //there is no object to render, using redirect
});

//have front end info in backend, now update dbase
//use object as dbase, we have key, change longURL in object

//Most specific to least specific, there this POST before next
//POST request to removes a URL resource: POST /urls/:shortURL/delete
// delete longURL from dbase using req, res
app.post('/urls/:shortURL/delete', (req, res) => { //SAVE longURL from short
  //send request to delete, use params  
  const shortUrl = req.params.shortURL; 
  console.log(shortUrl); 
  //get longURL from dbase, access property of object (dbase), shortURL is key   
  delete urlDatabase[req.params.shortURL]; // value of shortUrl is the key; longURL is value. 
  //console.log(urlDatabase);
  res.redirect('/urls'); //redirect back to list of URLs. Can't be longURL cause redirect to whatever put in
});

app.post("/urls", (req, res) => { //SAVE longURL from short
  //console.log(req.body); 
  const shortUrl = generateRandomString(); // from above
  //console.log(shortUrl);
  const longUrl = req.body.longURL; // grabbing the long url from the form body  
  //console.log(longUrl)
  urlDatabase[shortUrl] = longUrl // value of shortUrl is the key; longURL is value. 
  //console.log(urlDatabase);
  res.redirect("/urls"); //redirect back to list of URLs. Can't be longURL cause redirect to whatever put in
});

//access urlDatabase object 
app.get("/urls/:shortURL", (req, res) => { //added : means what comes after is parameter (object where key is name, value is what user types in to browser)
  console.log(req.params.shortURL); //takes in what user puts in ie. http://localhost:8080/urls/helen
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]}; // want JS to get two to match 
  //console.log("here: >>>>>>>>", urlDatabase[req.params.shortURL]);
  res.render("urls_show", templateVars); //passed both urls into templateVars object 
});

//can verify with curl -i http://localhost:8080/hello
// run from new terminal, with server up in other terminal

/* Pseudocode
  * SAVE the POST requests body to the server 
  * Call will generate random URL (short URL) string from function
  * Store longURL in dbase, with shortURL as key
  * Value stored is container [req.body.longURL] in dbase 
  * Then call fn and get short URL
  * res.send("Ok"); completes request 
  * res.redirect('/urls'); //redirect replaces the send

  *Modify routes to render templates 
  *Pass username to EJS template
  *Know if user logged in, and username 

  */

//Curl validate if URL is saved in dbase
//Browser validate if redirect is occurring