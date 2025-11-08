import express from 'express';
import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger.json' with { type: 'json' };
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'GrainTrack API Documentation',
      version: '1.0.0',
    },
    tags: [
      { name: 'System', description: 'System health and status endpoints' },
      { name: 'User', description: 'User management and authentication' },
      { name: 'Crops', description: 'Crop management' },
      { name: 'Locations', description: 'Location management' },
      { name: 'Machines', description: 'Machine management' },
      { name: 'Operators', description: 'Operator management' },
      { name: 'Weighings', description: 'Weighing records and search' },
    ],
    components: {
      schemas: {
        Location: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            isSource: { type: 'boolean' },
            isDestination: { type: 'boolean' },
          },
        },
        Crop: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
          },
        },
        Operator: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
          },
        },
        Machine: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            licensePlate: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            description: { type: 'string' },
            canDeliver: { type: 'boolean' },
            canHarvest: { type: 'boolean' },
          },
        },
      },
      parameters: {
        deletedQuery: {
          in: 'query',
          name: 'deleted',
          schema: {
            type: 'boolean',
          },
          description: 'Include deleted records',
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/router/*.ts'],
};

const swaggerDocument = swaggerJsdoc(options);

export const swaggerRouter = express.Router();

swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerDocument), swaggerUi.serve);
