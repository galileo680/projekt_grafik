const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../util/database');
const scheduleController = require('../controllers/scheduleController');

router.get('/:username', auth, (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(403).send('Access denied');
  }

  // User has access, fetch their schedule
  //   const query = `
  //         SELECT * FROM WorkerSchedules
  //         WHERE userId = ?
  //         ORDER BY dayOfWeek, startTime
  //     `;

  //   const query = `
  //     SELECT WorkerSchedules.*, Users.username FROM WorkerSchedules
  //     JOIN Users ON WorkerSchedules.userId = Users.id
  //     WHERE WorkerSchedules.userId = ?
  //     ORDER BY dayOfWeek, startTime
  // `;

  const query = `
    SELECT WorkerSchedules.*, Users.username FROM WorkerSchedules
    JOIN Users ON WorkerSchedules.userId = Users.id
    ORDER BY dayOfWeek, startTime
`;

  db.query(query, [req.user.id], (err, results) => {
    if (err) throw err;

    // Pass the schedule data to the view
    console.log(results);
    res.render('schedule/schedule', {
      username: req.user.username,
      schedule: results,
    });
  });
});

router.post('/submit', auth, scheduleController.submitSchedule);

module.exports = router;
