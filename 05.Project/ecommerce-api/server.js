import dotenv from 'dotenv';
import dbConnection from './src/config/database.js';
import chalk from 'chalk';
import app from './app.js';

import fs from 'fs';

// Cargamos variables de entorno predeterminadas, intentando primero .env.production si existe localmente
if (fs.existsSync('./.env.production')) {
  dotenv.config({ path: './.env.production' });
} else {
  dotenv.config(); // Fallback a .env estándar si existe
}

dbConnection(); // Conecta a la base de datos MongoDB

app.listen(process.env.PORT, () => {
  if (!process.env.PORT || !process.env.MONGODB_URI) 
  {
    console.error('❌ Variables de entorno faltantes: PORT o MONGODB_URI');
    process.exit(1);
  }
  console.log(chalk.green(`Server running on http://localhost:${process.env.PORT}`));
});