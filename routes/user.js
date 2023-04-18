const express = require('express');
const path = require('path');

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

//const db = require('../util/database');
const userMiddleware = require('../middleware/user.js');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/login');
}); //userController.getIndex

router.post('/sign-up', (req, res, next) => {});
router.post('/login', (req, res, next) => {});

router.get('/secret-route', (req, res, next) => {
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = router;
