const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./errors');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '641219ddf298ad95265a4e42',
  };
  next();
});
app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);
app.use('/cards', cardRouter);
app.use('/users', userRouter);

app.use('*', (req, res, next) => {
  const err = new Error(`${ERROR_NOT_FOUND} Not Found`);
  err.statusCode = ERROR_NOT_FOUND;
  next(err);
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Порт - ${PORT}, сервер запущен`);
});
