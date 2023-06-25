// controllers/scheduleController.js
const db = require('../util/database');
const ScheduleModel = require('../models/scheduleModel');

// exports.getSchedule = (req, res) => {
//   if (req.user.username !== req.params.username) {
//     return res.status(403).send('Access denied');
//   }

//   const query = `
//     SELECT WorkerSchedules.*, Users.username FROM WorkerSchedules
//     JOIN Users ON WorkerSchedules.userId = Users.id
//     ORDER BY dayOfWeek, startTime
// `;

//   db.query(query, [req.user.id], (err, results) => {
//     if (err) throw err;

//     // Pass the schedule data to the view
//     //console.log(results);
//     const errorMessage = req.query.error;
//     res.render('schedule/schedule', {
//       username: req.user.username,
//       schedule: results,
//       error: errorMessage,
//     });
//   });
// };

// exports.submitSchedule2 = (req, res) => {
//   // The new schedule to be submitted
//   const newSchedule = {
//     dayOfWeek: Number(req.body.dayOfWeek),
//     startTime: req.body.startTime,
//     endTime: req.body.endTime,
//     userId: req.user.id, // Save the userId along with the schedule
//   };

//   console.log('typeof: ', typeof newSchedule.dayOfWeek);
//   // Query to get all schedules for the same day of the week

//   const query = 'SELECT * FROM WorkerSchedules WHERE dayOfWeek = ?';
//   db.query(
//     query,
//     [newSchedule.dayOfWeek, newSchedule.userId],
//     (err, schedules) => {
//       if (err) throw err;

//       //console.log('schedules: ', schedules);

//       // Check if the new schedule overlaps with any existing schedule
//       for (let schedule of schedules) {
//         //console.log('sprawdzam overlapping');
//         if (
//           newSchedule.startTime < schedule.endTime &&
//           newSchedule.endTime > schedule.startTime
//         ) {
//           return res.redirect(
//             `/grafik/${req.user.username}?error=The proposed working hours overlap with an existing schedule.`
//           );
//         }
//       }

//       // If there's no overlap, insert the new schedule
//       const insertQuery = 'INSERT INTO WorkerSchedules SET ?';
//       db.query(insertQuery, [newSchedule], (err, results) => {
//         if (err) throw err;
//         res.redirect(`/grafik/${req.user.username}`);
//       });
//     }
//   );
// };

exports.getSchedule = (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(403).send('Access denied');
  }

  // Interact with the model to get the data
  ScheduleModel.getSchedule(req.user.id, (err, results) => {
    if (err) throw err;

    const errorMessage = req.query.error;
    res.render('schedule/schedule', {
      username: req.user.username,
      schedule: results,
      error: errorMessage,
    });
  });
};

exports.submitSchedule2 = (req, res) => {
  // The new schedule to be submitted
  const newSchedule = {
    dayOfWeek: Number(req.body.dayOfWeek),
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    userId: req.user.id,
  };

  // Interact with the model to check the data and submit the schedule
  ScheduleModel.checkAndSubmitSchedule(
    newSchedule,
    req.user.username,
    (err, overlapExists) => {
      if (err) throw err;

      if (overlapExists) {
        return res.redirect(
          `/grafik/${req.user.username}?error=The proposed working hours overlap with an existing schedule.`
        );
      }

      res.redirect(`/grafik/${req.user.username}`);
    }
  );
};
