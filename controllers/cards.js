const Card = require('../models/card');
const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (e) {
    console.error(e);
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: userId });
    return res.status(201).send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      console.log(e);
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные при создании карточки',
      });
    }
    console.error(e);
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(ERROR_NOT_FOUND).send({
        message: 'Карточка с указанным _id не найдена',
      });
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      console.log(e);
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные',
      });
    }
    console.error(e);
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

const putCardLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) {
      return res.status(ERROR_NOT_FOUND).send({
        message: 'Передан несуществующий _id карточки',
      });
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      console.log(e);
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка',
      });
    }
    console.error(e);
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};
const deleteCardLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) {
      return res.status(ERROR_NOT_FOUND).send({
        message: 'Передан несуществующий _id карточки',
      });
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      console.log(e);
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка',
      });
    }
    console.error(e);
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
