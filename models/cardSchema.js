const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
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
      //ссылка на модель автора карточки
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    likes: [{
      // список лайкнувших пост пользователей, массив ObjectId, по умолчанию — пустой массив (поле default)
    }],
    createAt: {
      type: Date,
      default: Date.now
    }
  }
)

module.exports = mongoose.model('card', cardSchema);