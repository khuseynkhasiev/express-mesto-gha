const Card = require('../models/card');
const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (e) {
    console.error(e);
    return res.status(500).send({message: 'Произошла ошибка'});
  }
}

const createCard = async (req, res) => {
  try {
    const card = await Card.create(req.body);
    return res.status(201).send(card);
  } catch (e) {
    console.error(e);
    return res.status(500).send({message: 'Произошла ошибка'});
  }
}

const deleteCard = async (req, res) => {
  const {cardId} = req.params;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    return res.status(200).send(card);
  } catch (e) {
    console.error(e);
    return res.status(500).send({message: 'Произошла ошибка'});
  }
}

const putCardLike = async (req, res) => {

  const userId = req.user._id;
  console.log(userId);

  const {cardId} = req.params;
  try {
    const card = await Card.findByIdAndUpdate(cardId, {$addToSet: {likes: userId}}, {new: true});
    return res.status(200).send(card);
  } catch (e) {
    console.error(e);
    return res.status(500).send({message: 'Произошла ошибка'});
  }
}
const deleteCardLike = async (req, res) => {
  const userId = req.user._id;
  const {cardId} = req.params;
  try {
    const card = await Card.findByIdAndUpdate(cardId, {$pull: {likes: userId}}, {new: true});
    return res.status(200).send(card);
  } catch (e) {
    console.error(e);
    return res.status(500).send({message: 'Произошла ошибка'});
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike
}