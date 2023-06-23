const mysql = require('mysql');

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Database is connected successfuly!');
});

module.exports = connection;
