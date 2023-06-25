const express = require('express');
const path = require('path');

//const db = require('../util/database');
const auth = require('../middleware/auth.js');

const userController = require('../controllers/userController.js');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/register');
});

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/register', (req, res) => {
  res.render('user/register');
});

router.get('/login', (req, res) => {
  res.render('user/login');
});

router.get('/logout', (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('token');
  // Redirect to the login page
  res.redirect('/login');
});

module.exports = router;
