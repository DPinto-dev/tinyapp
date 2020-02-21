const getUserByEmail = (inputEmail, usersObj) => {
  for (const user in usersObj) {
    if (usersObj[user].email === inputEmail) {
      return user;
    }
  }
  return undefined;
};

module.exports = getUserByEmail;
