const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { prisma, SECRET } = require('../utils/config');

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

  const token = jwt.sign({
    id: user.id,
  }, SECRET, { expiresIn: 60 * 60 });

  return res
    .status(200)
    .send({ token, username: user.username, email: user.email });
});

module.exports = loginRouter;
