const isUserLoggedIn = (user_id, usersDB) => {
  // Returns as soon as the user_id (from cookieSession)
  // is found in the 'usersDB'
  for (let user in usersDB) {
    if (usersDB[user].userId === user_id) {
      return true;
    }
  }
  return false;
};

module.exports = isUserLoggedIn;
