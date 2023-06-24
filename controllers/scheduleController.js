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

exports.submitSchedule2 = (req, res) => {
  // The new schedule to be submitted
  const newSchedule = {
    dayOfWeek: Number(req.body.dayOfWeek),
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    userId: req.user.id, // Save the userId along with the schedule
  };

  console.log('typeof: ', typeof newSchedule.dayOfWeek);
  // Query to get all schedules for the same day of the week
  const query =
    'SELECT * FROM WorkerSchedules WHERE dayOfWeek = ? AND userId = ?';
  db.query(
    query,
    [newSchedule.dayOfWeek, newSchedule.userId],
    (err, schedules) => {
      if (err) throw err;

      console.log('schedules: ', schedules);

      // Check if the new schedule overlaps with any existing schedule
      for (let schedule of schedules) {
        console.log('sprawdzam overlapping');
        if (
          newSchedule.startTime < schedule.endTime &&
          newSchedule.endTime > schedule.startTime
        ) {
          // There is an overlap
          return res
            .status(400)
            .send(
              'The proposed working hours overlap with an existing schedule.'
            );
        }
      }

      // If there's no overlap, insert the new schedule
      const insertQuery = 'INSERT INTO WorkerSchedules SET ?';
      db.query(insertQuery, [newSchedule], (err, results) => {
        if (err) throw err;
        res.redirect(`/grafik/${req.user.username}`);
      });
    }
  );
};
