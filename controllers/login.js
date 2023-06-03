const loginRouter = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../utils/config');

const prisma = new PrismaClient();

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: String(email),
    },
  });

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid email or password',
    });
  }

  const userForToken = {
    username: user.username,
    email: user.email,
    id: user.id,
  };

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 });

  return res
    .status(200)
    .send({ token, username: user.username, email: user.email });
});

module.exports = loginRouter;
