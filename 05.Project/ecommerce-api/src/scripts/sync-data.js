import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Category from '../models/category.js';
import Product from '../models/product.js';

// Configuración de rutas y variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Intentar cargar .env desde la raíz del backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

const categoriesPath = path.join(__dirname, '../../../ecommerce-app/src/data/categories.json');
const productsPath = path.join(__dirname, '../../../ecommerce-app/src/data/products.json');

const syncData = async () => {
  try {
    console.log('🚀 Iniciando sincronización de datos con Atlas...');

    // 1. Conexión a MongoDB
    const dbURI = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    
    if (!dbURI) throw new Error('MONGODB_URI no definida en .env');

    await mongoose.connect(dbURI, { dbName });
    console.log(`✅ Conectado a la base de datos: ${dbName}`);

    // 2. Leer archivos JSON
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    console.log(`📦 Leídas ${categoriesData.length} categorías y ${productsData.length} productos del frontend.`);

    // 3. Limpiar colecciones actuales
    console.log('🧹 Limpiando colecciones antiguas...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    // 4. Procesar y Cargar Categorías
    // Para las categorías, el JSON ya tiene los IDs manuales. 
    // Mongoose aceptará _id si se pasa explícitamente.
    const categoriesToInsert = categoriesData.map(cat => ({
      _id: cat._id,
      name: cat.name,
      description: cat.description,
      imageURL: cat.imageURL,
      parentCategory: cat.parentCategory ? (typeof cat.parentCategory === 'object' ? cat.parentCategory._id : cat.parentCategory) : null
    }));

    await Category.insertMany(categoriesToInsert);
    console.log('✅ Categorías sincronizadas correctamente.');

    // 5. Procesar y Cargar Productos
    const productsToInsert = productsData.map(prod => {
      // Extraer el ID de la categoría del objeto anidado
      let categoryId = null;
      if (prod.category) {
        categoryId = typeof prod.category === 'object' ? prod.category._id : prod.category;
      }

      return {
        _id: prod._id,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        image: prod.image,
        category: categoryId,
        // Los campos adicionales (platform, genre) los dejamos como opcionales o defaults
        platform: prod.platform || 'PC', 
        genre: prod.genre || 'Action',
        isFeatured: prod.isFeatured || false
      };
    });

    await Product.insertMany(productsToInsert);
    console.log('✅ Productos sincronizados correctamente.');

    console.log('✨ Sincronización completada con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error);
    process.exit(1);
  }
};

syncData();
