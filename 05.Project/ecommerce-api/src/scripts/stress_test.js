import axios from 'axios';

const API_URL = 'http://localhost:3000/api/products';
const TOTAL_REQUESTS = 110; // Un poco más que el límite de 100

async function runStressTest() {
  console.log(`🚀 Iniciando prueba de estrés: Enviando ${TOTAL_REQUESTS} peticiones a ${API_URL}...`);
  
  let successCount = 0;
  let blockedCount = 0;

  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    try {
      const response = await axios.get(API_URL);
      successCount++;
      if (i % 20 === 0) console.log(`✅ Petición ${i}: Exitosa (Status 200)`);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        blockedCount++;
        console.log(`🚫 Petición ${i}: BLOQUEADA (Status 429 - Too Many Requests)`);
        console.log(`Mensaje del servidor: ${JSON.stringify(error.response.data)}`);
        break; // Detenemos al primer bloqueo para no saturar más
      } else {
        console.error(`❌ Error en petición ${i}: ${error.message}`);
      }
    }
  }

  console.log('\n--- RESUMEN DE COMPORTAMIENTO ---');
  console.log(`Peticiones Exitosas: ${successCount}`);
  console.log(`Peticiones Bloqueadas: ${blockedCount}`);
  console.log(`Estado Final: ${blockedCount > 0 ? 'EL RATE LIMIT ESTÁ OPERATIVO ✅' : 'EL RATE LIMIT NO BLOQUEÓ ❌'}`);
}

runStressTest();
