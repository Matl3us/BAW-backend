require('dotenv').config();

//  Prisma
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
prisma.$executeRaw('ALTER TABLE "Rating" ADD CONSTRAINT "rating_range" CHECK ("score" >= 0 AND "score" <= 10)');

// .env variables
const { SECRET } = process.env;
const { validationResult } = require('express-validator');

module.exports = {
  prisma,
  SECRET,
  validationResult,
};
