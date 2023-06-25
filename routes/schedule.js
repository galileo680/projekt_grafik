const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../util/database');
const scheduleController = require('../controllers/scheduleController');

router.get('/:username', auth, scheduleController.getSchedule);

router.post('/submit', auth, scheduleController.submitSchedule2);

module.exports = router;
