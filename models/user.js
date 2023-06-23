const connection = require('../util/database');
const bcrypt = require('bcryptjs');

exports.createUser = (user, callback) => {
  const passwordHash = bcrypt.hashSync(user.password, 10);
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';

  connection.query(sql, [user.username, passwordHash], callback);
};

exports.findUserByUsername = (username, callback) => {
  const sql = 'SELECT * FROM users WHERE username = ?';

  connection.query(sql, [username], callback);
};
