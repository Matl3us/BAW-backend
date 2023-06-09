const ratingsRouter = require('express').Router();
const { prisma } = require('../utils/config');
const { getTokenFrom } = require('../utils/token');

ratingsRouter.post('/', async (req, res) => {
  const { showId, score, comment } = req.body;

  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  if (score < 0 || score > 10) {
    return res.status(400).json({
      error: 'invalid score value',
    });
  }

  const result = await prisma.rating.create({
    data: {
      score: Number(score),
      comment,
      added: new Date().toISOString(),
      user: { connect: { id: BigInt(userId) } },
      show: { connect: { id: BigInt(showId) } },
    },
  });

  return res.status(201).json(result);
});

ratingsRouter.get('/user', async (req, res) => {
  const userId = await getTokenFrom(req);

  const ratings = await prisma.rating.findMany({
    where: {
      showId: BigInt(userId),
    },
    include: {
      show: true,
    },
  });

  res.json(ratings);
});

module.exports = ratingsRouter;
