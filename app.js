const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6478df447abcf6511c9833c1',
  };

  next();
});

app.use('/', router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
