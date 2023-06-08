const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users');
const showsRouter = require('./routes/shows');
const episodesRouter = require('./routes/episodes');
const listsRouter = require('./routes/lists');
const { swaggerUi, swaggerSpec } = require('./utils/swagger');

// BigInt toJSON function implementation
// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/shows', showsRouter);
app.use('/api/episodes', episodesRouter);
app.use('/api/lists', listsRouter);

app.listen(port, () => console.log(`App listening on port ${port}!`));
