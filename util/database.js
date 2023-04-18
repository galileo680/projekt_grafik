const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'projekt',
  password: '1234',
});

connection.connect();
module.exports = connection;
