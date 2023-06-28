const connection = require('../util/database');

exports.createUserDetail = (userDetail, callback) => {
  const sql =
    'INSERT INTO user_details (user_id, name, surname, phone_number, email) VALUES (?, ?, ?, ?, ?)';
  connection.query(
    sql,
    [
      userDetail.userId,
      userDetail.name,
      userDetail.surname,
      userDetail.phone_number,
      userDetail.email,
    ],
    callback
  );
};
