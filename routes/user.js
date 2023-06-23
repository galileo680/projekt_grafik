const express = require('express');
const path = require('path');

//const db = require('../util/database');
const auth = require('../middleware/auth.js');

const userController = require('../controllers/user');

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

// router.get('/grafik', auth, (req, res) => {
//   res.send('grafik');
// });

router.get('/grafik/:username', auth, (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(403).send('Access denied');
  }

  // User has access, render the page
  res.send('Welcome to your personal grafik page!');
});

module.exports = router;
