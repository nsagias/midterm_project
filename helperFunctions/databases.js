const bcrypt = require('bcryptjs');
const moment = require('moment');


const users = {
  "815bd08a": {
    id: "815bd08a",
    name: "red",
    email: "red@example.com",
    password: bcrypt.hashSync('red', 10)
  },
  "ec3bdf7a": {
    id: "ec3bdf7a",
    name: "green",
    email: "green@example.com",
    password: bcrypt.hashSync('green', 10)
  },
  "1f1ffea1": {
    id: "1f1ffea1",
    name: "blue",
    email: "blue@example.com",
    password: bcrypt.hashSync('blue', 10)
  }
};


let urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "1f1ffea1",
    createdAt: moment().format('MMMM Do YYYY'),
  },
  "9sm5xk": {
    longURL: "http://www.google.com",
    userID: "1f1ffea1",
    createdAt: moment().format('MMMM Do YYYY'),
  },
  "9sm511": {
    longURL: "http://www.bingo.com",
    userID: "815bd08a",
    createdAt: moment().format('MMMM Do YYYY'),
  },
  "c2k511": {
    longURL: "http://www.yahoo.com",
    userID: "815bd08a",
    createdAt: moment().format('MMMM Do YYYY')
  }
};

module.exports = {
  users,
  urlDatabase,
};