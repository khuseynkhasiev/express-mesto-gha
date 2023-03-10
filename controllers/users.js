const User = require('../models/user');
const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (e) {
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные',
      });
    }
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    }
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

const patchUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const { name, about } = req.body;
    const user = await User.findOneAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

const patchUserAvatar = async (req, res) => {
  const userId = req.user._id;
  try {
    const { avatar } = req.body;
    const user = await User.findOneAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchUser,
  patchUserAvatar,
};
