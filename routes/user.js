const express = require('express');
const path = require('path');

//const db = require('../util/database');
const userMiddleware = require('../middleware/user.js');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/sign-up');
}); //userController.getIndex

router.post(
  '/sign-up',
  userMiddleware.validateRegister,
  userController.postSignup
);

router.post('/login', userController.postLogin);

router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('GRAFIK');
});

module.exports = router;
