const episodesRouter = require('express').Router();
const { prisma } = require('../utils/config');

episodesRouter.post('/', async (req, res) => {
  const {
    number, season, name, airDate, showName,
  } = req.body;

  const result = await prisma.episode.create({
    data: {
      number,
      season,
      name,
      airDate: new Date(airDate),
      show: { connect: { name: showName } },
    },
  });

  res.status(201).json(result);
});

module.exports = episodesRouter;
