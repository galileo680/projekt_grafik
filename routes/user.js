const express = require('express');
const path = require('path');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/', userController.getIndex);

module.exports = router;
