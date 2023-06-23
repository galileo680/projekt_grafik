// controllers/scheduleController.js
const db = require('../util/database');

exports.submitSchedule = (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const userId = req.user.id;

  // Check if the schedule overlaps with existing schedules
  const query = `
        SELECT * FROM WorkerSchedules
        WHERE userId = ? AND dayOfWeek = ? AND (
            (startTime BETWEEN ? AND ?) OR 
            (endTime BETWEEN ? AND ?) OR 
            (startTime <= ? AND endTime >= ?)
        )
    `;
  db.query(
    query,
    [
      userId,
      dayOfWeek,
      startTime,
      endTime,
      startTime,
      endTime,
      startTime,
      endTime,
    ],
    (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        // There's an overlapping schedule
        return res
          .status(400)
          .send('Your working hours overlap with an existing schedule.');
      }

      // No overlapping schedule, insert the new schedule into the database
      const insertQuery = `
            INSERT INTO WorkerSchedules (userId, dayOfWeek, startTime, endTime)
            VALUES (?, ?, ?, ?)
        `;
      db.query(
        insertQuery,
        [userId, dayOfWeek, startTime, endTime],
        (err, results) => {
          if (err) throw err;
          res.send('Schedule submitted successfully');
        }
      );
    }
  );
};
