const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/shows', async (req, res) => {
  const shows = await prisma.show.findMany();
  res.json(shows);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
