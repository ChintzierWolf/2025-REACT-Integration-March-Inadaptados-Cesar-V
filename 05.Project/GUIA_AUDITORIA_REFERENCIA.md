# Guía de Referencia: Auditoría y Mejores Prácticas de Despliegue en la Nube

> **Propósito de este documento:** Esta guía está diseñada para que cualquier desarrollador o Agente de IA entienda las bases estructurales necesarias para mantener un proyecto escalable, seguro y auditable. Utiliza la estructura de este proyecto (E-commerce MERN en Render) como molde o estándar de calidad para proyectos futuros o fases de desarrollo subsecuentes.

## ¿Por qué auditar cada paso del desarrollo?
La auditoría en el ciclo de vida del desarrollo de software (SDLC) no busca buscar culpables, sino **garantizar trazabilidad, seguridad y calidad**. Cuando un proyecto se despliega en la nube (ej. Render, AWS), los errores tienen un impacto en vivo. Una estructura auditable permite entender el *porqué* de una falla, *quién* o *qué* tomó la decisión arquitectónica, y asegura que ninguna pieza de código llegue a producción sin haber sido probada.

---

## 1. Integración Continua (CI) como Evidencia de Auditoría
No basta con afirmar que se realizan pruebas; el sistema debe imponerlas y registrar sus resultados automáticamente.

*   **Implementación de Referencia:** El uso de `.github/workflows/test.yml`.
*   **Por qué es auditable:** Este archivo asegura que cualquier cambio enviado al repositorio (`push` o `pull_request` a `main`) dispare automáticamente los tests (`npm run test:coverage`). Un auditor de código (o un agente futuro) puede revisar el historial de GitHub Actions y confirmar que la calidad del código no es opcional, sino una barrera automatizada antes del despliegue.

## 2. Trazabilidad Histórica de Incidentes y Decisiones
Un proyecto vivo acumula deuda técnica, incidentes y cambios de rumbo. Sobrescribir documentos antiguos elimina el contexto vital.

*   **Implementación de Referencia:** El directorio `docs/archive/` (que contiene archivos como `ANALISIS_PENDIENTE.md` y `AUDITORIA_2026.md`).
*   **Por qué es auditable:** Al guardar reportes de problemas pasados (como los fallos de timeout en Render), los desarrolladores o agentes futuros comprenden las vulnerabilidades históricas de la plataforma. Provee una fotografía en el tiempo que ayuda a no repetir los mismos errores de infraestructura.

## 3. Gobernanza Explícita y Contratos de Comportamiento
Para que múltiples desarrolladores o agentes de IA interactúen sin degradar el código, las reglas deben ser explícitas.

*   **Implementación de Referencia:** Archivos `GOVERNANCE.md` y los `AGENTS.md` locales en backend y frontend.
*   **Por qué es auditable:** Estos archivos establecen las "leyes" del repositorio. En una auditoría, se compara el código de producción directamente contra las reglas de gobernanza. Si un agente va a realizar un cambio, primero debe leer el `AGENTS.md` para entender los patrones permitidos (ej. qué librerías usar o cómo manejar estados).

## 4. Segregación de Entornos y Seguridad de Credenciales
La nube requiere credenciales que nunca deben versionarse en el repositorio público.

*   **Implementación de Referencia:** La distinción clara entre variables locales e inyecciones de nube (ej. `process.env.PORT` asignado por Render vs el puerto 3000 local, o `CORS_ORIGIN` en `.env.production`).
*   **Por qué es auditable:** Demuestra que la aplicación está lista para la nube, asumiendo que los secretos reales (`JWT_SECRET`, URIs de MongoDB Atlas) vivirán de forma segura en el gestor de variables de entorno de la plataforma de hosting (Render) y no en el código fuente.

## 5. Preparación Estructural: Carpetas de Documentación
El proyecto cuenta con carpetas destinadas a documentación técnica avanzada que, aunque puedan estar vacías al inicio, marcan el estándar esperado para escalar. 

**Recomendación de Buenas Prácticas:** Se debe crear un archivo `README.md` dentro de cada una de estas carpetas para definir su propósito, de modo que cualquier agente sepa cuándo y cómo utilizarlas:

*   **`docs/adrs/` (Architecture Decision Records):**
    *   *Propósito:* Registrar decisiones técnicas importantes (ej. "¿Por qué elegimos MongoDB en lugar de PostgreSQL?"). Cada vez que un agente altere la arquitectura, debe crear un registro aquí.
*   **`docs/contracts/`:**
    *   *Propósito:* Almacenar especificaciones de la API (ej. Swagger/OpenAPI, esquemas JSON). Auditable para confirmar que el backend y frontend se comunican con el mismo formato esperado.
*   **`docs/runbooks/`:**
    *   *Propósito:* Guías operativas paso a paso. ("¿Qué hacer si la base de datos se cae?", "¿Cómo reiniciar el servicio en Render?"). Auditable para evaluar la resiliencia operativa.
*   **`docs/threat-models/`:**
    *   *Propósito:* Documentar posibles vectores de ataque (DDoS, Inyección SQL) y sus mitigaciones. Auditable para certificaciones de seguridad.

---
*Fin de la Guía. Este documento debe ser el punto de partida consultivo (KI - Knowledge Item) para cualquier agente asignado a mantener o escalar la infraestructura de este proyecto.*
