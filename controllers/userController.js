// userController.js
const bcrypt = require('bcryptjs');
//const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const UserDetail = require('../models/userDetail');

exports.register = (req, res) => {
  User.findUserByUsername(req.body.username, (err, results) => {
    if (err) {
      return res.status(500).send('Server error!');
    }

    if (results.length > 0) {
      return res.status(400).send('User already exists');
    }

    User.createUser(req.body, (err, results) => {
      if (err) {
        return res.status(500).send('Server error');
      }

      const payload = {
        user: {
          id: results.insertId,
        },
      };

      const userId = results.insertId;

      // Here we are adding user details to the user_details table
      UserDetail.createUserDetail({ ...req.body, userId }, (err, results) => {
        if (err) {
          return res.status(500).send('Server error');
        }

        // continue with your existing code...
      });

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 3600, // 1 godzina
        },
        (err, token) => {
          if (err) throw err;
          //res.json({ token });
          //res.redirect('/login');
          return res.redirect('/login?registered=true');
        }
      );
    });
  });
};

exports.login = (req, res) => {
  User.findUserByUsername(req.body.username, (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).send('Invalid Credentials');
    }

    const isMatch = bcrypt.compareSync(req.body.password, results[0].password);

    if (!isMatch) {
      return res.status(400).send('Invalid Credentials');
    }

    const payload = {
      user: {
        id: results[0].id,
        username: results[0].username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true });
        //res.redirect('/grafik');
        res.redirect(`/grafik/${results[0].username}`);
      }
    );
  });
};
