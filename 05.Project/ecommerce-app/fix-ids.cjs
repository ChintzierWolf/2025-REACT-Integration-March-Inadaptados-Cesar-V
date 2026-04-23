const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const isValidHex = (str) => /^[0-9a-fA-F]{24}$/.test(str);

const usedIds = new Set();
let counter = 1000; // Empezar con un offset para evitar colisiones con categorías si se parecen

const fixedProducts = products.map((p, index) => {
  let newId = p._id;
  
  // Si el ID es inválido O si ya hemos visto este ID en este mismo array (duplicado)
  if (!isValidHex(newId) || usedIds.has(newId)) {
    do {
      // Generar un ID único basado en un prefijo constante + contador hex
      const prefix = '68b0d4189b825d20ce1e';
      const suffix = (counter++).toString(16).padStart(4, '0');
      newId = prefix + suffix;
    } while (usedIds.has(newId));
  }
  
  usedIds.add(newId);
  return { ...p, _id: newId };
});

fs.writeFileSync(productsPath, JSON.stringify(fixedProducts, null, 2));
console.log(`✅ products.json corregido: ${fixedProducts.length} productos procesados con IDs únicos.`);
