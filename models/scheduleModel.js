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
    // const query =
    //   'SELECT * FROM WorkerSchedules WHERE dayOfWeek = ? AND userId = ?';
    // db.query(
    //   query,
    //   [newSchedule.dayOfWeek, newSchedule.userId],
    //   (err, schedules) => {
    //     if (err) return callback(err);
    //     // Check if the new schedule overlaps with any existing schedule
    //     for (let schedule of schedules) {
    //       if (
    //         newSchedule.startTime < schedule.endTime &&
    //         newSchedule.endTime > schedule.startTime
    //       ) {
    //         // There is an overlap
    //         return callback(null, true);
    //       }
    //     }
    //     // If there's no overlap, insert the new schedule
    //     const insertQuery = 'INSERT INTO WorkerSchedules SET ?';
    //     db.query(insertQuery, [newSchedule], (err) => {
    //       if (err) return callback(err);
    //       callback(null, false);
    //     });
    //   }
    // );
    const query = 'SELECT * FROM WorkerSchedules WHERE dayOfWeek = ?';

    db.query(query, [newSchedule.dayOfWeek], (err, schedules) => {
      if (err) return callback(err);

      // Create Date objects for the new schedule's start and end times
      const newStart = new Date(`1970-01-01T${newSchedule.startTime}:00`);
      const newEnd = new Date(`1970-01-01T${newSchedule.endTime}:00`);

      for (let schedule of schedules) {
        // Create Date objects for the existing schedule's start and end times
        const existingStart = new Date(`1970-01-01T${schedule.startTime}:00`);
        const existingEnd = new Date(`1970-01-01T${schedule.endTime}:00`);

        if (newStart < existingEnd && newEnd > existingStart) {
          return callback(null, 'overlap');
        }
      }

      const insertQuery = 'INSERT INTO WorkerSchedules SET ?';
      db.query(insertQuery, [newSchedule], callback);
    });
  },
};

module.exports = ScheduleModel;
