const showsRouter = require('express').Router();
const { prisma, validationResult } = require('../utils/config');
const {
  validateSearchQuery,
  validateShowBody,
} = require('../utils/validation');

/**
 * Get a paginated list of tv shows
 */
showsRouter.get('/', async (req, res) => {
  const page = req.query.page ?? 1;

  if (Number.isNaN(+page)) {
    return res.status(400).json({ error: 'invalid page number' });
  }

  const shows = await prisma.show.findMany({
    skip: (+page - 1) * 20,
    take: 20,
  });

  const result = {};

  result.prevPage = page > 1 ? `/shows?page=${+page - 1}` : null;
  result.nextPage = shows.length < 20 ? null : `/shows?page=${+page + 1}`;

  result.shows = JSON.parse(JSON.stringify(shows));

  return res.status(200).json(result);
});

/**
 * Get all tv shows with search query
 */
showsRouter.get('/all', validateSearchQuery, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  const { search } = req.query;
  const shows = await prisma.show.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
  });

  const result = {
    shows,
  };

  return res.status(200).json(result);
});

/**
 * Get a details of a tv show
 */
showsRouter.get('/:id', async (req, res) => {
  try {
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

    return res.status(200).json(show);
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

/**
 * Add a new tv show
 */
showsRouter.post('/', validateShowBody, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  const {
    name, description, country, imagePath,
  } = req.body;

  try {
    await prisma.show.create({
      data: {
        name,
        description,
        country,
        imagePath,
      },
    });

    return res.status(201).json({ message: 'show saved' });
  } catch {
    return res.status(400).json({ error: 'invalid request' });
  }
});

module.exports = showsRouter;
