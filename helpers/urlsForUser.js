// Filter and returns URLs 'owned' by a particular user
const urlsForUser = (userId, urlDatabase) => {
  let filteredURLS = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userId === userId) {
      filteredURLS[url] = urlDatabase[url];
    }
  }
  return filteredURLS;
};

module.exports = urlsForUser;
