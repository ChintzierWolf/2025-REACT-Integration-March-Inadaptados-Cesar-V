import express from 'express';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import logger from './src/middlewares/logger.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';
import errorHandler from './src/middlewares/errorHandler.js';
import cors from 'cors';

dotenv.config();

setupGlobalErrorHandlers();

const app = express();

// Configurar CORS
// Permite peticiones del origen definido en .env (ej. localhost:3000) o de cualquier origen en desarrollo
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('WELCOME!');
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
  });
});

app.use(errorHandler);

export default app;
