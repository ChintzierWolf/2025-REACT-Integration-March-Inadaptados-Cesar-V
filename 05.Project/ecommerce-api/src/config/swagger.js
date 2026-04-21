import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API - Videojuegos',
      version: '1.0.0',
      description: 'API para la gestión de un e-commerce de videojuegos, incluyendo catálogo, carrito, favoritos y checkout.',
      contact: {
        name: 'Soporte Técnico',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desarrollo Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Rutas donde buscar anotaciones JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);
