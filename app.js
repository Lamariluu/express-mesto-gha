const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { createUserValidation, loginValidation } = require('./middlewares/validation');
const router = require('./routes/router');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;
app.use(express.json());
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use(router);
app.use(auth);
app.use(errors());
app.use(helmet);

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status)
    .send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, (err) => {
  // eslint-disable-next-line no-unused-expressions
  err ? console.log(err) : console.log(`App listening on ${PORT}`);
});
