const listsRouter = require('express').Router();
const { prisma } = require('../utils/config');
const { getTokenFrom } = require('../utils/token');

listsRouter.post('/', async (req, res) => {
  const { showId } = req.body;
  const userId = await getTokenFrom(req);

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
      showId: BigInt(userId),
    },
    include: {
      show: true,
    },
  });

  res.json(shows);
});

module.exports = listsRouter;
