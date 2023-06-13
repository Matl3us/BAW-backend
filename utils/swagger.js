const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express REST API for creating show watching list',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Episode' },
    { name: 'List' },
    { name: 'Rating' },
    { name: 'Show' },
    { name: 'User' },
  ],
  paths: {
    '/api/episodes': { post: { tags: ['Episode'] } },
    '/api/lists': {
      post: { tags: ['List'] },
      get: { tags: ['List'] },
      delete: { tags: ['List'] },
    },
    '/api/ratings': { post: { tags: ['Rating'] } },
    '/api/ratings/user': { get: { tags: ['Rating'] } },
    '/api/ratings/{id}': {
      put: { tags: ['Rating'] },
      delete: { tags: ['Rating'] },
    },
    '/api/shows': { get: { tags: ['Show'] }, post: { tags: ['Show'] } },
    '/api/shows/all': { get: { tags: ['Show'] } },
    '/api/shows/{id}': { get: { tags: ['Show'] } },
    '/api/login': { post: { tags: ['User'] } },
    '/api/users/register': { post: { tags: ['User'] } },
    '/api/shows/profile': { get: { tags: ['User'] } },
    '/api/shows/password': { put: { tags: ['User'] } },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
