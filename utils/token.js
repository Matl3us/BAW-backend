const jwt = require('jsonwebtoken');
const { prisma, SECRET } = require('./config');

// User token extraction
const getTokenFrom = async (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    try {
      const decodedToken = await jwt.verify(token, SECRET);
      const user = await prisma.user.findFirst({
        where: {
          id: BigInt(decodedToken.id),
        },
      });
      return user.id;
    } catch (error) {
      return null;
    }
  }
  return null;
};

module.exports = {
  getTokenFrom,
};
