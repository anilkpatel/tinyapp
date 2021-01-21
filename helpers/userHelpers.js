//Lighthouse Labs
//Week 3, Day 3
//TinyApp, Helper functions
//Anil Patel

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
  return users[email].password === password
};

module.exports = { emailExists, passwordMatching }
//modules.passwordMatching = passwordMatching
//modules.emailExists = emailExists

//module.exports = { emailExists: emailExists, passwordMatching: passwordMatching }