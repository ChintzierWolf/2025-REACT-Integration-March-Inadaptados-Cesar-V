// Importamos mongoose, el ODM que nos permite interactuar con MongoDB de forma sencilla
import mongoose from 'mongoose';

// Importamos dotenv para cargar las variables de entorno desde el archivo .env
import dotenv from 'dotenv';

// Inicializamos dotenv para que process.env tenga acceso a las variables definidas en .env
dotenv.config();

// Función asíncrona que establece la conexión con la base de datos
const dbConnection = async () => {
  try {
    // Obtenemos la URI base del servidor MongoDB y el nombre opcional de la base de datos desde .env
    const dbURI = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB; // Opcional si la URI ya lo trae

    // Validamos que la URI esté definida
    if (!dbURI) 
    {
      console.error('❌ Error: MONGODB_URI no está definido en el archivo de entorno.');
      process.exit(1); // Finaliza el proceso si faltan variables críticas
    }

    // Opciones de configuración
    const options = {};

    // Si MONGODB_DB fue provisto explícitamente, lo inyectamos aquí (ideal para Mongoose > 6)
    // Esto evita concatenar strings que rompen URLs de MongoDB Atlas (mongodb+srv://...)
    if (dbName) {
      options.dbName = dbName;
    }

    await mongoose.connect(dbURI, options);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ MongoDB conectado a la base de datos "${dbName || 'default'}"`);
    }

    // 🔌 Eventos de conexión para monitoreo y debugging
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose está conectado a MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('⚠️ Error en la conexión de Mongoose:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose se ha desconectado de MongoDB');
    });
  } 

  catch (error) 
  {
    // Si ocurre un error, lo mostramos en consola
    console.error('❌ Error al conectar con MongoDB:', error);

     // Finalizamos el proceso para evitar que la app corra sin base de datos
    process.exit(1);
  }
};

// Exportamos la función para que pueda ser usada en server.js
export default dbConnection;


/*
// Importamos mongoose para manejar la conexión con MongoDB
import mongoose from "mongoose";

// Función que conecta a la base de datos usando la URI del archivo .env
export const dbConnection = async () => {
  try 
  {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado correctamente");
  } 
  
  catch (error) 
  {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1); // Finaliza el proceso si falla la conexión
  }
};
*/