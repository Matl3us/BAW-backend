const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { prisma, validationResult } = require('../utils/config');
const { getTokenFrom } = require('../utils/token');
const {
  validateRegisterBody,
  validateUpdatePasswordBody,
} = require('../utils/validation');

const saltRounds = 10;

/**
 * Register a new user
 */
usersRouter.post('/register', validateRegisterBody, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  const { username, email, password } = req.body;

  const existingUser = await prisma.user.findMany({
    where: {
      OR: [{ username: String(username) }, { email: String(email) }],
    },
  });

  if (existingUser.length > 0) {
    return res.status(400).json({
      error: 'username and email must be unique',
    });
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
      },
    });

    return res.status(201).json({ message: 'user created' });
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

/**
 * Change user's password
 */
usersRouter.put('/password', validateUpdatePasswordBody, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
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

  try {
    await prisma.user.update({
      data: {
        password: passwordHash,
      },
      where: { id: BigInt(userId) },
    });

    return res.status(200).json({
      message: 'password changed successfully',
    });
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

/**
 * Get user's detailed information
 */
usersRouter.get('/profile', async (req, res) => {
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: BigInt(userId) },
    });

    delete user.password;

    return res.status(200).json(user);
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

module.exports = usersRouter;
