const usersRouter = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

usersRouter.post('/', async (req, res) => {
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

  const saltRounds = 10;
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

module.exports = usersRouter;
