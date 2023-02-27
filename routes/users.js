const router = require('express').Router();
const user = require('../models/userSchema')
router.get('/', (req, res) => {
  //возвращает всех пользователей
  console.log('роут гет сработал');
})

router.get('/:userId', (req, res) => {
  //возвращает пользователя по ID
})

router.post('/', (req, res) => {
  // создаем пользователя
  const {name, about, avatar} = req.body;
  console.log(req);
  console.log('роут пост сработал');
  user.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}))
})

module.exports = router;