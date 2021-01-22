//Lighthouse Labs
//Week 3, Day 3
//TinyApp, Helper functions
//Anil Patel


//const keys = Object.keys(urlsForUser(id)) //define fn with args, pass args to fn, invoke fn with params
  //console.log(keys)

///If someone tries to register with email already in users object, send back 400 status code

const emailExists = (users, email) => {
  for(let key in users) {
    if(users[key].email === email) return true
  }
  return false
}

//If the e-mail or password are empty strings, send back response with 400 status code
const passwordMatching = (users, email, password) => {
  if (!password.length) return false;
  for(let userID in users) {
    if (users[userID].email === email && users[userID].password === password) {
      return true;
    }
  }
  return false; 
};

//getUser
const getUser = (users, email) => {
  for (let userID in users) {
    if(email = users[userID].email) {
      return users[userID];
    }
  }
  return null;
}

//getUser by ID
const getUserById = (users, id) => {
  for (let userID in users) {
    if(id = users[userID].id) {
      return users[userID];
    }
  }
  return null;
}



module.exports = { emailExists, passwordMatching, getUser, getUserById }
//modules.passwordMatching = passwordMatching
//modules.emailExists = emailExists

//module.exports = { emailExists: emailExists, passwordMatching: passwordMatching }