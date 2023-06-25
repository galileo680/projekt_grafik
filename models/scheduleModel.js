const db = require('../util/database');

const ScheduleModel = {
  getSchedule: function (userId, callback) {
    const query = `
        SELECT WorkerSchedules.*, Users.username FROM WorkerSchedules
        JOIN Users ON WorkerSchedules.userId = Users.id
        ORDER BY dayOfWeek, startTime
      `;

    db.query(query, [userId], callback);
  },

  checkAndSubmitSchedule: function (newSchedule, username, callback) {
    const query =
      'SELECT * FROM WorkerSchedules WHERE dayOfWeek = ? AND userId = ?';

    db.query(
      query,
      [newSchedule.dayOfWeek, newSchedule.userId],
      (err, schedules) => {
        if (err) return callback(err);

        // Check if the new schedule overlaps with any existing schedule
        for (let schedule of schedules) {
          if (
            newSchedule.startTime < schedule.endTime &&
            newSchedule.endTime > schedule.startTime
          ) {
            // There is an overlap
            return callback(null, true);
          }
        }

        // If there's no overlap, insert the new schedule
        const insertQuery = 'INSERT INTO WorkerSchedules SET ?';
        db.query(insertQuery, [newSchedule], (err) => {
          if (err) return callback(err);

          callback(null, false);
        });
      }
    );
  },
};

module.exports = ScheduleModel;
