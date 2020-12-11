const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6) + Math.random().toString(36).substr(2, 6);
};

const addUser = (obj, id, email, password) => {
  obj[id] = {"id": id, 'email': email, 'password': password};
};

const emailExist = (obj, email) => {
  const keys = Object.keys(obj);
  for (let k of keys) {
    if (obj[k]['email'] === email) {
      return true;
    }
  }
  return false;
};

const urlsForUser = (urlObj,id) => {
  const res = [];
  for (let url in urlObj) {
    if (urlObj[url]['userID'] === id) {
      res.push(url);
    }
  }
  return res;
};

const userByEmail = function(obj, email) {
  const keys = Object.keys(obj);
  for (let k of keys) {
    if(obj[k]['email'] === email) {
      return obj[k];
    }
  }
}

module.exports = {generateRandomString, addUser, emailExist, urlsForUser, userByEmail, }