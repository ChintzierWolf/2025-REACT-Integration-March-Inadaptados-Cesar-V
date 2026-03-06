# Nuevas Propuestas y Posibles Mejoras (Actualizado)

Tras el análisis a profundidad del código actual de `ecommerce-api` y `ecommerce-app`, se identifican nuevas áreas de mejora además de las especificadas en `improvements.md`.

## 1. Backend (`ecommerce-api`)

### 1.1 Inconsistencias entre Modelos y Rutas

- Existen modelos para `Review`, `ShippingAddress`, `WishList`, pero no hay rutas explícitas (`routes/`) para gestionarlas.
- **Mejora**: Implementar de forma completa los controladores y rutas (CRUD) para `reviews` (poder dejar calificaciones a productos), `shippingAddresses` (manejo de múltiples direcciones por usuario), y `wishList` (favoritos).

### 1.2 Lógica de Relaciones (Mongoose Middleware)

- El modelo `Review` incluye middleware para recalcular rating en el modelo `Product`. Esto es una buena práctica.
- **Mejora**: Extender estos middlewares (Pre/Post hooks) para otras entidades asociadas. Ej. si se elimina un usuario (`User`), realizar borrado lógico/físico en cascada en `Cart` y `Orders` correspondientes.

### 1.3 Escalabilidad de la Estructura (Patrón Repository)

- Reforzando la idea de `improvements.md`, el número de controladores está creciendo (8+ archivos). Migrar la lógica de acceso a datos a la capa `services` facilitará la inyección de dependencias para Testing y mantenibilidad.

## 2. Frontend (`ecommerce-app`)

### 2.1 Conexión con Backend Real

- Actualmente el proyecto frontend usa una carpeta `services/` que simula respuestas de servidor con variables mock y delays ficticios.
- **Mejora Urgente**: Modificar los archivos en `services/` (ej. `fetchResource`) reemplazando los `setTimeout` por peticiones HTTP reales (usando `axios` o `fetch` nativo) apuntando a `http://localhost:<PORT>/api/...`.
- **Manejo de CORS**: Asegurarse de tener habilitado `cors` en el servidor backend (revisión de `app.js` mostró que en algunos casos está ausente o parcial).

### 2.2 Gestión de Sesiones Segura

- Almacenar el JWT y estados transaccionales. Actualmente `CartContext` usa localStorage, lo cual está bien para MVP, pero para el User Payload (token) se requiere seguridad adicional.
- **Mejora**: Usar HTTP-Only Cookies en lugar de `localStorage` para almacenar tokens, o implementar manejos robustos de caducidad.

### 2.3 Refinamiento de Componentes Reutilizables

- Faltan componentes complejos para visualización de datos vacíos ("No tienes órdenes por ahora"), skeletons (cargas asíncronas), y paginadores visuales correspondientes a `/api/products?page=1`.

## 3. QA y Testing

### 3.1 Pruebas de los Nuevos Módulos

- Faltan pruebas completas para los módulos "ocultos" de la base de datos: `Cart`, `Category`, `Review`.
- **Mejora**: Ampliar matriz de pruebas y suite Vitest para validar las reglas de negocio, como la unicidad de las categorías y las restricciones del carrito.
