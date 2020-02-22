const { assert } = require("chai");

const { getUserByEmail, isUserLoggedIn } = require("../helpers/_helpers.js");

const testUsers = {
  userRandomID: {
    userId: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    userId: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe("getUserByEmail", function() {
  it("should return a user with valid email", () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it("should return undefined when passed a non-existant email", () => {
    const nonExistantEmail = getUserByEmail("end@less.horse", testUsers);
    const expectedOutput = undefined;
    assert.isUndefined(nonExistantEmail);
  });
});

describe("isUserLoggedIn", () => {
  it(`should return true if the user currently on the cookie is 
  foun in the user DB`, () => {
    const currentUser = "userRandomID";
    const checkLogin = isUserLoggedIn(currentUser, testUsers);
    assert.equal(checkLogin, true);
  });
  it("should return false if the user is not found", () => {
    const currentUser = "36w24d";
    const checkLogin = isUserLoggedIn(currentUser, testUsers);
    assert.equal(checkLogin, false);
  });
});
