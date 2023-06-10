const listsRouter = require('express').Router();
const { prisma } = require('../utils/config');
const { getTokenFrom } = require('../utils/token');

listsRouter.post('/', async (req, res) => {
  const { showId } = req.body;
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  const result = await prisma.list.create({
    data: {
      user: { connect: { id: BigInt(userId) } },
      show: { connect: { id: BigInt(showId) } },
    },
  });

  return res.status(201).json(result);
});

listsRouter.get('/', async (req, res) => {
  const userId = await getTokenFrom(req);

  const shows = await prisma.list.findMany({
    where: {
      userId: BigInt(userId),
    },
    include: {
      show: true,
    },
  });

  res.json(shows);
});

listsRouter.delete('/', async (req, res) => {
  const { showId } = req.body;
  const userId = await getTokenFrom(req);

  if (!userId) {
    return res.status(401).json({
      error: 'invalid user token',
    });
  }

  await prisma.list.deleteMany({
    where: {
      showId: BigInt(showId),
      userId: BigInt(userId),
    },
  });

  return res.status(201).json(
    { message: 'deleted successfully' },
  );
});

module.exports = listsRouter;
