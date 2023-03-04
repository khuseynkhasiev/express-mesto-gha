const mongoose = require('mongoose');

const card = new mongoose.Schema({
    name: {
      required: true,
      type: String,
      minlength: 2,
      maxlength: 30
    },
    link: {
      required: true,
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: []
    }],
    createAt: {
      type: Date,
      default: Date.now
    }
  }
)

module.exports = mongoose.model('card', card);