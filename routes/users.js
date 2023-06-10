const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { prisma } = require('../utils/config');
const { getTokenFrom } = require('../utils/token');

const saltRounds = 10;

usersRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await prisma.user.findMany({
    where: {
      OR: [
        { username: String(username) },
        { email: String(email) },
      ],
    },
  });

  if (existingUser.length > 0) {
    return res.status(400).json({
      error: 'username and email must be unique',
    });
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: passwordHash,
    },
  });

  return res.status(201).json(user);
});

usersRouter.put('/password', async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: BigInt(userId),
    },
  });

  const passwordCorrect = user === null ? false : await bcrypt.compare(oldPassword, user.password);

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'password incorrect',
    });
  }

  const passwordHash = await bcrypt.hash(newPassword, saltRounds);

  await prisma.user.update({
    data: {
      password: passwordHash,
    },
    where: { id: BigInt(userId) },
  });

  return res.status(200).json({
    message: 'password changed successfully',
  });
});

usersRouter.get('/profile', async (req, res) => {
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  const user = await prisma.user.findFirst({
    where: { id: BigInt(userId) },
  });

  delete user.password;

  return res.status(200).json(user);
});

module.exports = usersRouter;
