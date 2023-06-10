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
      userId: BigInt(userId),
    },
    include: {
      show: true,
    },
  });

  res.json(ratings);
});

ratingsRouter.put('/:id', async (req, res) => {
  const { score, comment } = req.body;
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  await prisma.rating.update({
    data: {
      score: Number(score),
      comment,
      added: new Date().toISOString(),
    },
    where: { id: BigInt(req.params.id) },
  });

  return res.status(200).json(
    { message: 'updated successfully' },
  );
});

ratingsRouter.delete('/:id', async (req, res) => {
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  await prisma.list.deleteMany({
    where: {
      id: BigInt(req.params.id),
      userId: BigInt(userId),
    },
  });

  return res.status(201).json(
    { message: 'deleted successfully' },
  );
});

module.exports = ratingsRouter;
