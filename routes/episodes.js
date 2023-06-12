const episodesRouter = require('express').Router();
const { prisma, validationResult } = require('../utils/config');
const { validateEpisodeBody } = require('../utils/validation');

/**
 * Add a new episode to the database
*/
episodesRouter.post('/', validateEpisodeBody, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }

  const {
    number, season, name, airDate, showName,
  } = req.body;

  try {
    const result = await prisma.episode.create({
      data: {
        number,
        season,
        name,
        airDate: new Date(airDate),
        show: { connect: { name: showName } },
      },
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'invalid request' });
  }
});

module.exports = episodesRouter;
