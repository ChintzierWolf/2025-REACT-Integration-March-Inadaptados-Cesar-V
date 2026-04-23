# Roadmap de Mejoras e Innovación Tecnológica (Post-MVP)

Este documento define la ruta para elevar la calidad, escalabilidad y experiencia de usuario del ecosistema e-commerce.

---

## 🎨 1. Frontend: Arquitectura y Experiencia (Advanced UI)

### 🏎️ Gestión de Estado y Caching
- **TanStack Query (React Query)**: Sustituir las llamadas directas de Axios en componentes por hooks de React Query. Esto permitirá:
    - Autocaching: Los datos de productos se cargan instantáneamente tras la primera visita.
    - Background Sync: Actualización silenciosa de stock.
    - Manejo de estados de carga y error uniforme en toda la app.
- **Zustand**: Migrar de múltiples directores `Context` a un store centralizado con Zustand. Reduce re-renders innecesarios y simplifica la lógica de negocio (especialmente para el Carrito y Auth).

### 💎 Diseño Premium y Micro-interacciones
- **Shadcn/UI**: Adoptar este sistema de componentes basado en Radix UI y Tailwind para una interfaz más consistente, accesible y de aspecto industrial.
- **Framer Motion**: Implementar transiciones de página suaves y animaciones de "salida" del carrito para reforzar el sentimiento premium.
- **Skeleton Loaders**: Sustituir el texto "Cargando..." por placeholders animados de carga que simulen la estructura de las tarjetas de productos.

---

## ⚙️ 2. Backend: Robustez y API Design

### 📑 Documentación Automática
- **Swagger / OpenAPI 3.0**: Integrar `swagger-jsdoc` y `swagger-ui-express`. La documentación de la API quedará disponible bajo `/api-docs`, permitiendo interactuar con los endpoints sin herramientas externas.

### 🛡️ Seguridad y Resiliencia
- **Rate Limiting**: Implementar `express-rate-limit` para prevenir ataques de fuerza bruta en el login y abuso de la API.
- **Data Validation Hardening**: Migrar de `express-validator` a **Zod** para validaciones de esquema más potentes y seguras, compartiendo tipos si se usa TypeScript en el futuro.
- **Winston + Morgan**: Implementar un sistema de logging profesional categorizado (error, info, audit) que guarde logs rotativos en archivos y consola.

### ⚡ Optimización de Base de Datos
- **Aggregation Pipelines**: Optimizar el cálculo de subtotales y reportes de órdenes directamente en MongoDB para mayor velocidad en el checkout.
- **Indexes**: Verificar y estabilizar índices en `Product (name, category)` y `User (email)` para consultas de alto volumen.

---

## 🚀 3. DevOps e Infraestructura

### 📦 Dockerización
- **Docker Compose**: Crear un entorno reproducible con `docker-compose.yml` que orqueste la API, la App y una instancia local de MongoDB (o se conecte a la actual).
- **Multi-stage Builds**: Optimizar las imágenes de producción para reducir el tamaño y mejorar la seguridad.

### 🚥 CI/CD (Continuous Integration / Deployment)
- **GitHub Actions**: Configurar pipelines automáticos para:
    1. Ejecutar Vitest (Unitarios e Integración) en cada PR.
    2. Ejecutar Cypress (E2E) en staging.
    3. Linting automático (ESLint + Prettier).
    4. Auto-deploy a Vercel (Frontend) y Render/Railway (Backend).

---

## 🛍️ 4. Funcionalidades de Negocio (Scale-Up)

### 📊 Dashboard Administrativo
- Panel de control avanzado para el rol `admin`:
    - Gráficos de ventas (Chart.js / Recharts).
    - Gestión masiva de stock con edición in-place.
    - Visualización de tráfico en tiempo real.

### 🔍 Search & Filters (Elastic-like)
- Búsqueda con **Autocomplete** conforme el usuario escribe.
- Filtros dinámicos por rango de precio, plataforma y género sin recargar la página.

### 💌 Sistema de Notificaciones
- Integración con **Nodemailer / SendGrid**:
    - Email de bienvenida al registro.
    - Confirmación de orden con PDF de factura.
    - Alerta de "Producto de nuevo en stock" para la Wishlist.

---

*Documento de visión técnica - Antigravity AI*
