const User = require('../models/userSchema');
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (e) {
    console.error(e);
    return res.status(500).send({message: 'Произошла ошибка'})
  }
}

const getUser = async (req, res) => {
  const {userId} = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({message: 'User not found'});
    }
    return res.status(200).send(user);
  } catch (e) {
    console.error(e);
    return res.status(500).send({message: 'Произошла ошибка'})
  }
}

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).send(user);
  } catch (e) {
    console.error(e);
    return res.status(500).send({message: 'Произошла ошибка'});
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser
}