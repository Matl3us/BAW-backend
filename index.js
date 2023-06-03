const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');
const showsRouter = require('./controllers/shows');
const episodesRouter = require('./controllers/episodes');

// BigInt toJSON function implementation
// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use(cors());
app.use(express.json());

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/shows', showsRouter);
app.use('/api/episodes', episodesRouter);

app.listen(port, () => console.log(`App listening on port ${port}!`));
