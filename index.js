const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// BigInt toJSON function inplementation
// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.get('/shows', async (req, res) => {
  const shows = await prisma.show.findMany();
  res.json(shows);
});

app.get('/shows/:id', async (req, res) => {
  const show = await prisma.show.findMany({
    where: { id: Number(req.params.id) },
    include: {
      episodes: true,
    },
  });

  res.json(show);
});

app.post('/shows', async (req, res) => {
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

  res.json(result);
});

app.post('/episodes', async (req, res) => {
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

  res.json(result);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
