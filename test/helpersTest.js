//Lighthouse Labs
//Week 3, Day 4
//TinyApp
//Anil Patel

const { assert } = require('chai');

const { emailExists } = require('../helpers/userHelpers.js');

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
};

//NOTE: helpers directory, userHelpers.js and emailExists helper function were developed from day 1, and take place of nomenclature in COMPASS

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = emailExists(users, "user@example.com")
    const expectedOutput = true;
    // 1) Assert statement: Confirm getUserByEmail returns user object if email exists in database
    assert.strictEqual(user, expectedOutput); //1st paramenter is actual
  });

  it('should return false for an email not in the database', function() {
    const user = emailExists(users, "popcorn@popcorn.com")
    const expectedOutput = false;
    //2) Assert statement: Pass in an email NOT in users database, getUserByEmail funtion should return undefined
    assert.strictEqual(user, expectedOutput); //1st paramenter is actual
  });

  it('should return false for a non-existent email', function() {
    const user = emailExists(users, "butterchicken.com")
    const expectedOutput = false;
    // 3) Assert statement: Test that a non-existent email returns undefined
    assert.strictEqual(user, expectedOutput); //1st paramenter is actual
  });
});

/*
Expected output:
getUserByEmail
    ✓ should return a user with valid email
    ✓ should return false for an email not in the database
    ✓ should return false for a non-existent email
3 passing (60ms)
*/