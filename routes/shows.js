const showsRouter = require('express').Router();
const { prisma } = require('../utils/config');

showsRouter.get('/', async (req, res) => {
  const page = req.query.page ?? 1;
  const shows = await prisma.show.findMany({
    skip: (page - 1) * 20,
    take: 20,
  });

  const result = {};

  result.nextPage = shows.length < 20 ? null : `/shows?page=${+page + 1}`;
  result.shows = JSON.parse(JSON.stringify(shows));

  res.json(result);
});

showsRouter.get('/all', async (req, res) => {
  const shows = await prisma.show.findMany();
  res.json(shows);
});

showsRouter.get('/:id', async (req, res) => {
  const show = await prisma.show.findMany({
    where: { id: BigInt(req.params.id) },
    include: {
      episodes: true,
    },
  });

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