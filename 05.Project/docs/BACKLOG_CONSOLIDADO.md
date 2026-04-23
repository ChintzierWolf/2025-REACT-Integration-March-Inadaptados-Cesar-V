# BACKLOG CONSOLIDADO Y ESTADO DEL SISTEMA
**Fecha de Auditoría:** Abril 2026
**Estado:** Fuente de verdad técnica.

## 1. RESUMEN EJECUTIVO
El ecosistema E-Commerce (MERN) ha superado exitosamente su fase inicial (MVP) y las épicas de estabilización críticas (Épicas 1-6). La integración entre el Frontend (React) y el Backend (Express) está casi al **100%**, logrando eliminar mocks y el uso excesivo de `localStorage` para almacenamiento persistente. 

El enfoque actual debe cambiar de **construcción funcional** a **optimización, calidad (QA) y documentación técnica**.

---

## 2. ESTADO DE INTEGRACIÓN FE-BE

| Módulo | Funcionalidad | API Endpoints | Estado | Frontend | Backend |
|--------|---------------|---------------|--------|----------|---------|
| **Autenticación** | Registro, Login | `/api/auth/*` | ✅ Integrado | Zustand + `http.js` | JWT, Bcrypt |
| **Catálogo** | Listar, Filtrar | `/api/products/*` | ✅ Integrado | React Query (`useProducts`) | Mongoose Aggregations |
| **Carrito** | Agregar, Quitar | `/api/cart/*` | ✅ Integrado | Zustand (`useCartStore`) | Sync a MongoDB |
| **Checkout/Órdenes**| Completar orden | `/api/orders/*` | ✅ Integrado | React Query (`useOrders`) | Valida Auth y Cart |
| **Usuarios** | Perfil, Update | `/api/users/*` | ✅ Integrado | `userService.js` real | Controladores listos |
| **Wishlist** | Agregar/Quitar | `/api/wishlist/*` | ✅ Integrado | `useWishlist` Hook | Endpoints listos |
| **Reseñas (Reviews)**| Leer/Crear | `/api/reviews/*` | ✅ Integrado | `ProductDetails.jsx` | Controladores listos |

---

## 3. INVENTARIO DE PERSISTENCIA Y LOCALSTORAGE

Se realizó una limpieza masiva de `localStorage`. Actualmente solo se utiliza para:
- **`token`**: JWT de acceso temporal. (Correcto, aunque migrable a HttpOnly Cookies a futuro).
- **Theme/Preferencias**: UI configuration (Dark/Light mode).
- **No se usa para:** Historial de órdenes, carrito principal, ni perfiles de usuario. Todo esto ya se encuentra respaldado en la base de datos (MongoDB).

---

## 4. REFACTORS NECESARIOS (DEUDA TÉCNICA)

1. **Optimización de Rendimiento Frontend:**
   - **Lazy Loading y Code Splitting:** `React.lazy` no se está utilizando ampliamente para rutas grandes (Checkout, Orders, Wishlist).
   - **Optimización de Imágenes:** Minimizar peso y tamaño de renders.
2. **Estandarización de Estado (Zustand vs React Query):**
   - Asegurarse de que el uso de Zustand se limite a estado global (UI, Auth, Cart temporal) y TanStack Query a server-state (Orders, Products, Reviews).
3. **Seguridad (Opcional pero recomendado):**
   - Implementar Rate Limiting agresivo en backend (`express-rate-limit`).
   - Evaluar migración de JWT de `localStorage` a Cookies Seguras.

---

## 5. ESTADO DE DOCUMENTACIÓN TÉCNICA Y SWAGGER

| Documento / Área | Estado Actual | Acción Requerida |
|------------------|---------------|------------------|
| Documentación API | ✅ Completado | Mantener actualizado en `/api/docs` con Swagger JSDoc. |
| `AGENTS.md` | ✅ Actualizados | Mantenerlos alineados a nuevas rutas. |
| Modelos DB | ✅ Documentados | En `AGENTS.md` y código fuente. |

---

## 6. BACKLOG ESTRUCTURADO (EPIC 8: QUALITY & OPTIMIZATION)

### 🔴 Crítico (Optimización & Performance)
1. **[FE-01]** Implementar Code Splitting con `React.lazy()` y `Suspense` en el router principal de la app. **(En proceso)**
2. **[SEC-01]** Añadir `helmet` y `express-rate-limit` a la API para reforzar la seguridad de producción.

### 🟡 Alto (QA & Refinamiento)
3. **[UNIT-01]** Finalizar cobertura de Unit Testing con Vitest en Backend (Controllers de Orders y Cart).
4. **[FE-02]** Migrar componentes restantes de `useEffect` a `useQuery` de TanStack (si aplica).

### 🟢 Completado (Done)
- **[E2E-01]** Configurar e implementar Cypress para flujos críticos (Login, Checkout completo). ✅
- **[DOCS-01]** Implementar `swagger-ui-express` y documentar todos los endpoints de `ecommerce-api`. ✅
- **[CLEAN-01]** Limpieza de advertencias ESLint y variables no utilizadas en componentes críticos. ✅
- **[ARCH-01]** Organización de documentación obsoleta en `/docs/archive`. ✅
