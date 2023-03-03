const mongoose = require('mongoose');

const user = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minLength: 2,
    maxlength: 30
  },
  about: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    required: true,
    type: String,
  }
})

module.exports = mongoose.model('user', user);