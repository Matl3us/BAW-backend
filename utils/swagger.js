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
    '/api/episodes': {
      post: { tags: ['Episode'], summary: 'Add a new episode' },
    },

    '/api/lists': {
      post: { tags: ['List'], summary: 'Add a new tv show to the watch list' },
      get: {
        tags: ['List'],
        summary: "Get a list of tv shows from user's watchlist",
      },
      delete: {
        tags: ['List'],
        summary: "Delete tv show from user's watchlist",
      },
    },

    '/api/ratings': {
      post: { tags: ['Rating'], summary: 'Add a new rating to the tv show' },
    },
    '/api/ratings/user': {
      get: {
        tags: ['Rating'],
        summary: "Get a list of user's tv show ratings",
      },
    },
    '/api/ratings/{id}': {
      put: { tags: ['Rating'], summary: 'Update tv show rating' },
      delete: { tags: ['Rating'], summary: 'Delete tv show rating' },
    },

    '/api/shows': {
      get: { tags: ['Show'], summary: 'Get a paginated list of tv shows' },
      post: { tags: ['Show'], summary: 'Add a new tv show' },
    },
    '/api/shows/all': {
      get: { tags: ['Show'], summary: 'Get all tv shows with search query' },
    },
    '/api/shows/{id}': {
      get: { tags: ['Show'], summary: 'Get a details of a tv show' },
    },

    '/api/login': {
      post: { tags: ['User'], summary: 'User login' },
    },
    '/api/users/register': {
      post: { tags: ['User'], summary: 'Register a new user' },
    },
    '/api/users/password': {
      put: { tags: ['User'], summary: 'Change user\'s password' },
    },
    '/api/users/profile': {
      get: { tags: ['User'], summary: 'Get user\'s detailed information' },
    },
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
