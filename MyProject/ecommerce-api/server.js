import express from 'express';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';
import logger from './src/middlewares/logger.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';
import errorHandler from './src/middlewares/errorHandler.js'; // Importar errorHandler
import chalk from 'chalk';

dotenv.config();

// Configurar manejadores globales ANTES de crear la app
setupGlobalErrorHandlers(); // Captura errores como excepciones no atrapadas y promesas rechazadas

const app = express(); // Inicializa la aplicación Express
dbConnection(); // Conecta a la base de datos MongoDB

// Middlewares en el orden correcto
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(logger); // Middleware para registrar cada petición (útil para debugging y auditoría)

app.get('/', (req, res) => {
  res.send('WELCOME!'); // Ruta base para verificar que el servidor está corriendo
});

app.use('/api', routes); // Todas las rutas se agrupan bajo /api

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
  });
});

// El errorHandler debe ir AL FINAL, después de todas las rutas
app.use(errorHandler); // Captura errores lanzados por cualquier ruta o middleware

app.listen(process.env.PORT, () => {
  if (!process.env.PORT || !process.env.MONGO_URI) 
  {
    console.error('❌ Variables de entorno faltantes: PORT o MONGO_URI');
    process.exit(1);
  }
  console.log(chalk.green(`Server running on http://localhost:${process.env.PORT}`));
});