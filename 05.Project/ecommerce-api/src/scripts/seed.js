import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import dbConnection from '../config/database.js';
import bcrypt from 'bcrypt';

import Category from '../models/category.js';
import Product from '../models/product.js';
import User from '../models/user.js';
import ShippingAddress from '../models/shippingAddress.js';
import PaymentMethod from '../models/paymentMethod.js';

if (fs.existsSync('./.env.production')) {
  dotenv.config({ path: './.env.production' });
} else {
  dotenv.config();
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const categoriesPath = path.resolve(__dirname, '../../../ecommerce-app/src/data/categories.json');
const productsPath = path.resolve(__dirname, '../../../ecommerce-app/src/data/products.json');

const testUsersData = [
  {
    displayName: 'Usuario Demo',
    email: 'demo@test.com',
    password: 'password123',
    role: 'customer',
    phone: '5551234567'
  },
  {
    displayName: 'Admin Test',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    phone: '5559876543'
  }
];

const seedData = async () => {
  try {
    await dbConnection();
    console.log(chalk.blue('🌱 Iniciando script de Data Seeding...'));

    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await ShippingAddress.deleteMany();
    await PaymentMethod.deleteMany();
    console.log(chalk.yellow('🧹 Colecciones limpiadas.'));

    // === CATEGORÍAS ===
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    const categoryMap = {};

    console.log(chalk.blue(`📂 Insertando ${categoriesData.length} categorías...`));
    
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
    console.log(chalk.green('✅ Categorías insertadas.'));

    // === PRODUCTOS ===
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    console.log(chalk.blue(`🎮 Insertando ${productsData.length} productos...`));

    for (let i = 0; i < productsData.length; i++) {
      const prod = productsData[i];
      const oldCategoryId = prod.category._id;
      const targetCategoryId = categoryMap[oldCategoryId];

      if (!targetCategoryId) {
        console.log(chalk.red(`⚠️ Categoría no encontrada para ${prod.name}. Saltando.`));
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
    console.log(chalk.green('✅ Productos insertados.'));

    // === USUARIOS ===
    console.log(chalk.blue('👥 Insertando usuarios de prueba...'));
    const createdUsers = [];

    for (const userData of testUsersData) {
      const hashPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        displayName: userData.displayName,
        email: userData.email,
        hashPassword,
        role: userData.role,
        phone: userData.phone
      });
      createdUsers.push(user);
      console.log(chalk.gray(`   - ${userData.email} (${userData.role})`));
    }
    console.log(chalk.green('✅ Usuarios insertados.'));

    // === DIRECCIONES DE ENVÍO ===
    console.log(chalk.blue('📍 Insertando direcciones de envío...'));
    
    const addressesData = [
      {
        userId: createdUsers[0]._id,
        name: 'Casa Principal',
        address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
        city: 'Ciudad de México',
        state: 'CDMX',
        postalCode: '03100',
        country: 'México',
        phone: '5551234567',
        isDefault: true,
        addressType: 'home'
      },
      {
        userId: createdUsers[0]._id,
        name: 'Oficina',
        address: 'Paseo de la Reforma 500, Piso 10',
        city: 'Ciudad de México',
        state: 'CDMX',
        postalCode: '06600',
        country: 'México',
        phone: '5559876543',
        isDefault: false,
        addressType: 'work'
      },
      {
        userId: createdUsers[1]._id,
        name: 'Dirección Principal',
        address: 'Av. Patriotismo 789, Col. San Ángel',
        city: 'Ciudad de México',
        state: 'CDMX',
        postalCode: '03730',
        country: 'México',
        phone: '5551112222',
        isDefault: true,
        addressType: 'home'
      }
    ];

    for (const addr of addressesData) {
      await ShippingAddress.create({
        user: addr.userId,
        name: addr.name,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
        phone: addr.phone,
        isDefault: addr.isDefault,
        addressType: addr.addressType
      });
      console.log(chalk.gray(`   - ${addr.name} para ${addr.userId.toString().slice(-8)}`));
    }
    console.log(chalk.green('✅ Direcciones insertadas.'));

    // === MÉTODOS DE PAGO ===
    console.log(chalk.blue('💳 Insertando métodos de pago...'));
    
    const paymentMethodsData = [
      {
        userId: createdUsers[0]._id,
        type: 'credit_card',
        cardNumber: '4111111111111234',
        cardHolderName: 'Usuario Demo',
        expiryDate: '12/27',
        isDefault: true
      },
      {
        userId: createdUsers[0]._id,
        type: 'debit_card',
        cardNumber: '5555555555555678',
        cardHolderName: 'Usuario Demo',
        expiryDate: '06/26',
        isDefault: false
      },
      {
        userId: createdUsers[1]._id,
        type: 'paypal',
        paypalEmail: 'admin@test.com',
        isDefault: true
      }
    ];

    for (const pm of paymentMethodsData) {
      await PaymentMethod.create({
        user: pm.userId,
        type: pm.type,
        cardNumber: pm.cardNumber,
        cardHolderName: pm.cardHolderName,
        expiryDate: pm.expiryDate,
        paypalEmail: pm.paypalEmail,
        isDefault: pm.isDefault
      });
      const label = pm.type === 'paypal' ? `PayPal: ${pm.paypalEmail}` : `Tarjeta terminada en ${pm.cardNumber.slice(-4)}`;
      console.log(chalk.gray(`   - ${label}`));
    }
    console.log(chalk.green('✅ Métodos de pago insertados.'));

    console.log(chalk.bgGreen.black('\n 🚀 DATA SEEDING COMPLETADO CON ÉXITO '));
    console.log(chalk.blue('\n📋 Credenciales de prueba:'));
    console.log(chalk.gray('   Customer: demo@test.com / password123'));
    console.log(chalk.gray('   Admin:    admin@test.com / admin123'));

    process.exit(0);

  } catch (error) {
    console.error(chalk.red('❌ Error en el Data Seeding:'), error);
    process.exit(1);
  }
};

seedData();
