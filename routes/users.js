var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var jwt = require('jsonwebtoken');

router.post('/register', function(req, res, next) {
  var user = new User({
    email: req.body.email,
    fname: req.body.fname,
    lname: req.body.lname,
    number: req.body.number,
    employeeid: req.body.employeeid,
    password: User.hashPassword(req.body.password),
    creation_dt: Date.now()
  });

  let promise = user.save();

  promise.then(function(doc) {
    return res.status(201).json(doc);
  })

  promise.catch(function(err) {
    return res.status(501).json({
      message: 'ERROR REGISTERING USER'
    })
  })
});

router.post('/login', function(req, res, next) {
  let promise = User.findOne({
    email: req.body.email
  }).exec();

  promise.then(function(doc) {
    if (doc) {
      if (doc.isValid(req.body.password)) {
        //generate token
        let token = jwt.sign({
          username: doc.fname
        }, 'secret', {
          expiresIn: '1h'
        });
        return res.status(201).json(token);
      } else {
        return res.status(501).json({
          message: 'INVALID PASSWORD'
        });
      }
    } else {
      return res.status(501).json({
        message: 'USER NOT FOUND'
      });
    }
  });

  promise.catch(function(err) {
    return res.status(501).json({
      message: 'ERROR WHILE LOGGING IN'
    })
  })
});


router.get('/username', verifyToken, function(req, res, next) {
  return res.status(200).json(decodedToken.username);
});

var decodedToken = '';

function verifyToken(req, res, next) {
  let token = req.query.token;

  jwt.verify(token, 'secret', function(err, tokendata) {
    if (err) {
      return res.status(400).json({
        message: 'invalid user'
      });
    }
    if (tokendata) {
      decodedToken = tokendata;
      next();
    }
  })
}

module.exports = router;