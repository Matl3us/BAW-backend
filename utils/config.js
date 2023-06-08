require('dotenv').config();

//  Prisma
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// .env variables
const { SECRET } = process.env;

module.exports = {
  prisma,
  SECRET,
};
