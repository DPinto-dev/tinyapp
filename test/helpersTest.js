const { assert } = require("chai");

const { getUserByEmail } = require("../helpers/_helpers.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
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
