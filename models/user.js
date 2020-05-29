var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var schema = new Schema({
  email: {
    type: String,
    require: true
  },
  fname: {
    type: String,
    require: true
  },
  lname: {
    type: String,
    require: true
  },
  number: {
    type: String,
    require: true
  },
  employeeid: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  creation_dt: {
    type: Date,
    require: true
  }
});


schema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

schema.methods.isValid = function(hashedpassword) {
  return bcrypt.compareSync(hashedpassword, this.password);
}


module.exports = mongoose.model('User', schema);