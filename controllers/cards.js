const Card = require('../models/card');
const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
} = require('../errors');

// eslint-disable-next-line consistent-return
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (e) {
    next(e);
  }
};

// eslint-disable-next-line consistent-return
const createCard = async (req, res, next) => {
  const userId = req.cookies.id;
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: userId });
    return res.status(201).send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      const err = new Error('Переданы некорректные данные при создании карточки');
      err.statusCode = ERROR_INACCURATE_DATA;
      next(err);
    }
    next(e);
  }
};

// eslint-disable-next-line consistent-return
const deleteCard = async (req, res, next) => {
  const userId = req.cookies.id;

  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      const err = new Error('Карточка с указанным _id не найдена');
      err.statusCode = ERROR_NOT_FOUND;
      next(err);
    } else if (!userId === card.owner) {
      const err = new Error('Вы не можете удалить карточку другого пользователя');
      err.statusCode = ERROR_NOT_FOUND;
      next(err);
    } else {
      await Card.deleteOne(card);
      return res.status(200).send({ message: 'Карточка удалена' });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new Error('Переданы некорректные данные');
      err.statusCode = ERROR_INACCURATE_DATA;
      next(err);
    }
    next(e);
  }
};

// eslint-disable-next-line consistent-return
const putCardLike = async (req, res, next) => {
  const userId = req.cookies.id;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) {
      const err = new Error('Передан несуществующий _id карточки');
      err.statusCode = ERROR_NOT_FOUND;
      next(err);
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      const err = new Error('Переданы некорректные данные для постановки/снятии лайка');
      err.statusCode = ERROR_INACCURATE_DATA;
      next(err);
    }
    next(e);
  }
};
// eslint-disable-next-line consistent-return
const deleteCardLike = async (req, res, next) => {
  const userId = req.cookies.id;
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) {
      const err = new Error('Передан несуществующий _id карточки');
      err.statusCode = ERROR_NOT_FOUND;
      next(err);
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      const err = new Error('Переданы некорректные данные для постановки/снятии лайка');
      err.statusCode = ERROR_INACCURATE_DATA;
      next(err);
    }
    next(e);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
