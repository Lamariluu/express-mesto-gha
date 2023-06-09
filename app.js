const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/router');
const auth = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/handleErrors');

const app = express();
const {
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
  PORT = 3000,
} = process.env;

app.use(express.json());
app.use(router);
app.use(auth);
app.use(errors());
app.use(handleErrors);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, (err) => {
  // eslint-disable-next-line no-unused-expressions
  err ? console.log(err) : console.log(`App listening on ${PORT}`);
});
