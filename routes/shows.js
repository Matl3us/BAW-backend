const showsRouter = require('express').Router();
const { prisma } = require('../utils/config');

showsRouter.get('/', async (req, res) => {
  const page = req.query.page ?? 1;

  const shows = await prisma.show.findMany({
    skip: (page - 1) * 20,
    take: 20,
  });

  const result = {};

  result.nextPage = shows.length <= 20 ? null : `/shows?page=${+page + 1}`;
  result.prevPage = page > 1 ? `/shows?page=${+page - 1}` : null;

  result.shows = JSON.parse(JSON.stringify(shows));

  res.json(result);
});

showsRouter.get('/all', async (req, res) => {
  const search = req.query.search ?? null;
  const shows = await prisma.show.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
  });
  res.json(shows);
});

showsRouter.get('/:id', async (req, res) => {
  const show = await prisma.show.findFirst({
    where: { id: BigInt(req.params.id) },
    include: {
      episodes: true,
      ratings: true,
    },
  });

  const aggregation = await prisma.rating.aggregate({
    where: { showId: BigInt(req.params.id) },
    _avg: {
      score: true,
    },
  });
  show.score = aggregation._avg.score;

  res.json(show);
});

showsRouter.post('/', async (req, res) => {
  const {
    name, description, country, imagePath,
  } = req.body;

  const result = await prisma.show.create({
    data: {
      name,
      description,
      country,
      imagePath,
    },
  });

  res.status(201).json(result);
});

module.exports = showsRouter;
