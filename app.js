const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6403823bc422b225a6584a02',
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(ERROR_NOT_FOUND).send({ message: `${ERROR_NOT_FOUND} Not Found` }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('успешное подключение к базе!'))
  .catch((e) => console.log(`${e.name} - ошибка подключения к базе!`));

app.listen(PORT, () => {
  console.log(`Порт - ${PORT}, сервер запущен`);
});
