const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { prisma, SECRET, validationResult } = require('../utils/config');
const { validateLoginBody } = require('../utils/validation');

/**
 * User login
 */
loginRouter.post('/', validateLoginBody, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: String(email),
    },
  });

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'invalid email or password',
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    SECRET,
    { expiresIn: '2 days' },
  );

  return res
    .status(200)
    .send({ token, username: user.username, email: user.email });
});

module.exports = loginRouter;
