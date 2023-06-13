const ratingsRouter = require('express').Router();
const { prisma, validationResult } = require('../utils/config');
const { getTokenFrom } = require('../utils/token');
const {
  validateRatingBody,
  validateUpdateRatingBody,
} = require('../utils/validation');

/**
 * Add a new rating to the tv show
 */
ratingsRouter.post('/', validateRatingBody, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  const { showId, score, comment } = req.body;

  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  try {
    await prisma.rating.create({
      data: {
        score: Number(score),
        comment,
        added: new Date().toISOString(),
        user: { connect: { id: BigInt(userId) } },
        show: { connect: { id: BigInt(showId) } },
      },
    });

    return res.status(201).json({ message: 'rating saved' });
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

/**
 * Get a list of user's tv show ratings
 */
ratingsRouter.get('/user', async (req, res) => {
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  const ratings = await prisma.rating.findMany({
    where: {
      userId: BigInt(userId),
    },
    include: {
      show: true,
    },
  });

  return res.status(200).json(ratings);
});

/**
 * Update tv show rating
 */
ratingsRouter.put('/:id', validateUpdateRatingBody, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  const { score, comment } = req.body;
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  try {
    await prisma.rating.update({
      data: {
        score: Number(score),
        comment,
        added: new Date().toISOString(),
      },
      where: { id: BigInt(req.params.id) },
    });

    return res.status(200).json({ message: 'updated rating' });
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

/**
 * Delete tv show rating
 */
ratingsRouter.delete('/:id', async (req, res) => {
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  try {
    await prisma.list.deleteMany({
      where: {
        id: BigInt(req.params.id),
        userId: BigInt(userId),
      },
    });

    return res.status(201).json({ message: 'deleted rating' });
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

module.exports = ratingsRouter;
