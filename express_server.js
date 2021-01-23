//Lighthouse Labs
//Week 3, Day 1
//TinyApp
//Anil Patel

const { emailExists, passwordMatching, getUser, getUserById } = require("./helpers/userHelpers.js");
//const { emailExists, passwordMatching } = require('./helpers/userHelpers')

const express = require("express");
const app = express();
const PORT = 8080; // default 
const bcrypt = require('bcrypt');
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['TEST'],
  maxAge: 24 * 60 * 60 * 1000})); // 24 hours

const bodyParser = require("body-parser"); //convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body. 
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString() {
  let randomUrl = ""; //assign new value to variable, must be let 
  const universal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    randomUrl += universal.charAt(Math.floor(Math.random() * universal.length));
  return randomUrl;
};

//console.log(generateRandomString()); 

///urls page will filter the entire list in the urlDatabase 
//Compare userID with the logged-in user's ID
const urlDatabase = { //use JS to get long url from short url based on dabse 
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"}, 
  "9sm5xK": {longURL: "http://www.google.com", userID: "7sb4xk"}
};

function urlsForUser(id) { //look thru urlDatabase object dbase, keys are shortURL
  const urls = {}
  for (let shortURL in urlDatabase) {
    console.log(urlDatabase[shortURL].userID);
    if (urlDatabase[shortURL].userID === id){ //key is shortURL, and urlDatabase[shortURL] is object stored in that key
      urls[shortURL] = urlDatabase[shortURL].longURL;
      } 
  }
    console.log("here!", urls);
  return urls; 
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
  const templateVars = { user: null }; // Pass object to templetes via templateVars 
  res.render("login", templateVars); //local varibale
  //ONLY redirect on POST reqs
});

//User Registration Form
//GET /register endpoint for Registration Page 
app.get("/register", (req, res) => {  //returns registration template on the root path, "/".
  const templateVars = { user: null }; // Pass object to templetes via templateVars 
  res.render("register", templateVars); //local varibale
  //console.log();
});

//Registering New Users
//POST / register, to allow authentification / registration 
app.post("/register", (req, res) => { //add new user obj to new user dbase
  const {email, password} = req.body // destructuring 
  
  //console.log("here", emailExists(users, email), users[email], email);
  if(!emailExists(users,email) && password.length !== 0) { //Modify POST /register endpoint for erros:
    //register
    const userID = generateRandomString();
    let hashedPassword = bcrypt.hashSync(password, 10);
    //reg form in body of req, save into user object
    //user ID is key
    users[userID] = { //set up entry in object, userID is key and it has a value
     id: userID, 
     email, 
     password: hashedPassword, //BCRYPT: Modify registration endpoint with bcrypt to hash the password
    };
        
  req.session.user_id = userID;
  //res.cookie('user_id', userID);
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
  //res.cookie['user_id'];  
  req.session.user_id
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
  let userID = req.session.user_id; 
  //let userID = req.cookies["user_id"] //check cookies for userID, if have
  if (userID){
    let user = getUserById(users, userID)
    let urls = urlsForUser(userID);
    const templateVars = { urls: urls, user: user }; //pass user name to index, and can see header
    console.log(templateVars);
    res.render("urls_index", templateVars); //EJS looks inside views for extension .ejs
  } else { //don't have, send to register
    //res.send("please login first")
    res.redirect('/register')
  }
});

app.get("/urls/new", (req, res) => { //route handler will render the page with the form; needs to be defined before below 
  const templateVars = {user: req.session.user_id};
  //const templateVars = {user: req.cookies["user_id"]}; 
  res.render("urls_new", templateVars); //local varibale 
});

app.get("/u/:shortURL", (req, res) => { //GRAB longURL from short, use key value pairs 
  const shortUrl = req.params.shortURL; //not body, but params cause getting from url
  const templateVars = {longURL: urlDatabase[shortUrl], user_id: req.session.user_id["user_id"]}; 
  //const templateVars = {longURL: urlDatabase[shortUrl], user_id: req.cookies["user_id"]}; 
  res.redirect(templateVars); //sending in response, pass in template with data
});

//LOGIN ROUTE: Add endpoint to handle a POST to /login in your Express server
//modify POST /login to use email and password files and set user_id cookie at login. previous set a cookie named username

app.post('/login', (req, res) => { // post req with body, extract info from form 
  const {email, password} = req.body; // destructuring  
  //console.log(email, password); 
  if(emailExists(users,email) && passwordMatching(users, email, password)) {
  //password is salted  
    let userID = getUser(users, email).id
    req.session.user_id
    //res.cookie('user_id', userID); //setting user ID
    //const templateVars = {username: req.cookies["user_id"]}; 
    //console.log(users); //round brackets
    res.redirect("/urls");
    } else {
      // send 403
      const errors = []
      if(!password.length) errors.push('password length is 0')
      else errors.push('wrong credentials')
      res.status(403).json({ errors: errors.join(', ') })
    }
});

//LOGOUT ROUTE: 
//Modify logout endpoint to clear the correct user_id cookie instead of the username one.
//Previous: Add endpoint to handle a POST to /login in your Express server
app.post('/logout', (req, res) => { // post req with body
  //const userName = req.body.username; 
  req.session = null;
  //res.clearCookie('user_id')
  //res.clearCookie('username', userName) //set the cookie using key value pair; client gives username,  
  res.redirect('/login');
  //res.redirect('/urls'); //redirect back to list of URLs. Can't be longURL cause redirect to whatever put in
});

app.post ("/urls/:id", (req, res) => { //must match to front end urls_show, but back end noation for path
  const shortURL = req.params.id //request info from web site address, line 73 calls the web page
  const longURL = req.body.longURL //info from front end input
  console.log("start>>>>>>>>>>", longURL);
  urlDatabase[shortURL] = longURL //object with key = longURL
  res.redirect("/urls");  //there is no object to render, using redirect
});

// delete longURL from dbase using req, res
//Users Can Only Edit or Delete Their Own URLs
//shortURL/delete is dynamic, therefore Users Can Only Edit or Delete Their Own URLs
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
  urlDatabase[shortUrl] = { userID: req.session["user_id"], longURL: longUrl };  // Update, setting owner id and longURL; value of shortUrl is the key; longURL is value. 
  //console.log(urlDatabase);
  res.redirect("/urls"); //redirect back to list of URLs. Can't be longURL cause redirect to whatever put in
});

//access urlDatabase object 
app.get("/urls/:shortURL", (req, res) => { //added : means what comes after is parameter (object where key is name, value is what user types in to browser)
  console.log(req.params.shortURL); //takes in what user puts in ie. http://localhost:8080/urls/helen
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: req.session.user_id["username"]}; // want JS to get two to match 
  //const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: req.cookies["username"]}; // want JS to get two to match 
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