const listsRouter = require('express').Router();
const { prisma, validationResult } = require('../utils/config');
const { getTokenFrom } = require('../utils/token');
const { validateListBody } = require('../utils/validation');

/**
 * Add a new tv show to the watch list
 */
listsRouter.post('/', validateListBody, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  const { showId } = req.body;
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  try {
    await prisma.list.create({
      data: {
        user: { connect: { id: BigInt(userId) } },
        show: { connect: { id: BigInt(showId) } },
      },
    });
    return res.status(201).json({ message: 'tv show added to the watchlist' });
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

/**
 * Get a list of tv shows from user's watchlist
 */
listsRouter.get('/', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  const shows = await prisma.list.findMany({
    where: {
      userId: BigInt(userId),
    },
    include: {
      show: true,
    },
  });

  return res.status(200).json(shows);
});

/**
 * Delete tv show from user's watchlist
 */
listsRouter.delete('/', validateListBody, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  const { showId } = req.body;
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  try {
    await prisma.list.deleteMany({
      where: {
        showId: BigInt(showId),
        userId: BigInt(userId),
      },
    });

    return res.status(204).json({ message: 'deleted successfully' });
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

module.exports = listsRouter;
