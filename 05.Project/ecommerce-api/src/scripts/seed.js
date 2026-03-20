import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import dbConnection from '../config/database.js';

import Category from '../models/category.js';
import Product from '../models/product.js';

if (fs.existsSync('./.env.production')) {
  dotenv.config({ path: './.env.production' });
} else {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoriesPath = path.join(__dirname, '../../../ecommerce-app/src/data/categories.json');
const productsPath = path.join(__dirname, '../../../ecommerce-app/src/data/products.json');

const seedData = async () => {
  try {
    await dbConnection();
    console.log(chalk.blue('🌱 Iniciando script de Data Seeding...'));

    await Category.deleteMany();
    await Product.deleteMany();
    console.log(chalk.yellow('🧹 Colecciones Category y Product limpiadas.'));

    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    
    const categoryMap = {};

    console.log(chalk.blue(`📂 Se encontraron ${categoriesData.length} categorías. Insertando...`));
    
    for (const cat of categoriesData) {
        const parentCategoryId = cat.parentCategory?._id 
            ? categoryMap[cat.parentCategory._id] || null 
            : null;
            
        const newCat = await Category.create({
            name: cat.name,
            description: cat.description,
            imageURL: cat.imageURL,
            parentCategory: parentCategoryId
        });

        categoryMap[cat._id] = newCat._id; 
    }
    console.log(chalk.green(`✅ Categorías insertadas correctamente con jerarquía.`));

    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    console.log(chalk.blue(`🎮 Se encontraron ${productsData.length} productos. Insertando...`));

    for (let i = 0; i < productsData.length; i++) {
        const prod = productsData[i];
        
        const oldCategoryId = prod.category._id;
        const targetCategoryId = categoryMap[oldCategoryId];

        if (!targetCategoryId) {
            console.log(chalk.red(`⚠️ Advertencia: Categoría no encontrada para el producto ${prod.name}. Saltando.`));
            continue;
        }

        await Product.create({
            name: prod.name,
            price: prod.price,
            stock: prod.stock,
            description: prod.description,
            image: prod.image,
            category: targetCategoryId,
            isFeatured: i < 6,
        });
    }

    console.log(chalk.green(`✅ Productos insertados correctamente.`));
    console.log(chalk.bgGreen.black(' 🚀 DATA SEEDING COMPLETADO CON ÉXITO '));

    process.exit(0);

  } catch (error) {
    console.error(chalk.red('❌ Error en el Data Seeding:'), error);
    process.exit(1);
  }
};

seedData();
