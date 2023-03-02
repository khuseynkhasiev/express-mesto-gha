const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const path = require('path');

const {PORT = 3000} = process.env;

const app = express();

app.use(express.static(path.join((__dirname, 'public'))));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '63fe6b6ecebeeb60cd0bf266'
  };
  next();
})
app.use(routes);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
})
  .then(() => console.log('успешное подключение к базе!'))
  .catch(e => console.log(`${e.name} - ошибка подключения к базе`))

app.listen(PORT, () => {
  console.log(`Порт - ${PORT}, сервер запущен`);
})