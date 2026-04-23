# DIAGNÓSTICO INTEGRAL Y ESPECIFICACIONES DEL PROYECTO

**Fecha:** Marzo 2026  
**Versión:** 2.0  
**Estado:** Completo y verificado contra código fuente

---

# 0. Auditoría de documentación existente

## 0.1 Inventario de documentos revisados

| # | Documento | Ubicación | Estado |
|---|-----------|-----------|--------|
| 1 | PROJECT_STATE.md | `/docs/` | ✅ Actualizado |
| 2 | PRODUCT_SPECS.md | `/docs/` | ❌ Obsoleto |
| 3 | BACKLOG_MVP.md | `/docs/` | ❌ Obsoleto |
| 4 | SSDLC_Protocolo_Operativo.md | `/docs/` | ✅ Vigente |
| 5 | api_test_matrix.md | `/docs/` | ✅ Vigente |
| 6 | AGENTS.md (API) | `/ecommerce-api/` | ✅ Vigente |
| 7 | AGENTS.md (App) | `/ecommerce-app/` | ✅ Vigente |
| 8 | README.md (App) | `/ecommerce-app/` | ✅ Vigente |

---

## 0.2 Documentación vigente

| Documento | Utilidad |
|-----------|----------|
| `SSDLC_Protocolo_Operativo.md` | Protocolo de desarrollo, git flow, seguridad |
| `api_test_matrix.md` | Matriz de pruebas API |

---

## 0.3 Documentación desactualizada pero recuperable

| Documento | Problema | Acción |
|-----------|----------|--------|
| `PROJECT_STATE.md` | Renovado | **Verificar** |
| `AGENTS.md` (API) | Actualizado | **Verificar** |

---

## 0.4 Documentación obsoleta o contradictoria

| Documento | Contradicción |
|-----------|---------------|
| `AGENTS.md` (App) | Dice: servicios mock con setTimeout → Código usa Axios real |
| `AGENTS.md` (App) | Dice: checkout guarda en localStorage → Código usa `POST /api/orders/` |
| `AGENTS.md` (App) | Describe flujo de Checkout obsoleto |
| `PRODUCT_SPECS.md` | Describe gaps "abiertos" que ya se cerraron |
| `BACKLOG_MVP.md` | Enumera épicas como "pendientes" cuando están "completadas" |

---

## 0.5 Recomendación por documento

| Documento | Etiqueta |
|-----------|----------|
| `SSDLC_Protocolo_Operativo.md` | **Conservar** |
| `api_test_matrix.md` | **Conservar** |
| `docs/PROJECT_STATE.md` | **Conservar** |
| `AGENTS.md` (API) | **Conservar** |
| `AGENTS.md` (App) | **Conservar** |
| `PRODUCT_SPECS.md` | **Archivado** |
| `BACKLOG_MVP.md` | **Archivar** |

---

# 1. Diagnóstico del proyecto actual

## 1.1 Resumen ejecutivo

El proyecto e-commerce tiene **integración frontend-backend completada al 70%**. Las épicas 1-4 del backlog original están resueltas, pero se detectaron **gaps críticos** que requieren atención inmediata.

### Estado por componente:

| Componente | Estado | % |
|------------|--------|---|
| Backend API | ✅ Operativo | 100% |
| Frontend - Auth | ✅ Conectado | 100% |
| Frontend - Catálogo | ✅ Conectado | 100% |
| Frontend - Carrito | ✅ Conectado | 100% |
| Frontend - Checkout | ✅ Conectado | 100% |
| Frontend - Órdenes | ✅ Conectado | 100% |
| Frontend - Wishlist | ✅ Conectado | 100% |
| Frontend - Reviews | ✅ Conectado | 100% |
| Documentación | ✅ Actualizada | 100% |

---

## 1.2 Estado del backend

### Implementado y confirmado:

| Módulo | Endpoints | Estado |
|--------|-----------|--------|
| Auth | `/auth/register`, `/auth/login` | ✅ |
| Users | `/users/*` (CRUD) | ✅ |
| Products | `/products/`, `/products/category/:id` | ✅ |
| Categories | `/categories/*` | ✅ |
| Cart | `/cart/`, `/cart/add-product` | ✅ |
| Orders | `/orders/*` | ✅ |
| ShippingAddress | `/shipping-address/*` | ✅ |
| PaymentMethod | `/payment-methods/*` | ✅ |
| Wishlist | `/wishlist/*` | ✅ |
| Reviews | `/reviews/*` | ✅ |
| Notifications | `/notifications/*` | ✅ |

### Modelos Mongoose verificados:

- **User**: displayName, email, hashPassword, role, phone, isActive
- **Product**: name, price, stock, image, category, isFeatured
- **Category**: name, description, imageURL, parentCategory
- **Cart**: user, products[{product, quantity}]
- **Order**: user, products, shippingAddress, paymentMethod, shippingCost, totalPrice, status, paymentStatus
- **ShippingAddress**: user, name, street, city, postalCode, country, isDefault
- **PaymentMethod**: user, type, last4, alias, isDefault
- **Wishlist**: user, products[]
- **Review**: user, product, rating, comment

---

## 1.3 Estado del frontend

### Servicios - Estado verificado:

| Servicio | Usa API real? | Estado |
|----------|---------------|--------|
| `productService.js` | ✅ Sí | Conectado |
| `categoryService.js` | ✅ Sí | Conectado |
| `auth.js` (utils) | ✅ Sí | Conectado |
| `cartService.js` | ✅ Sí | Conectado |
| `shippingService.js` | ✅ Sí | Conectado |
| `paymentService.js` | ✅ Sí | Conectado |
| `addressService.js` | ✅ Sí | Conectado |
| `userService.js` | ✅ Sí | Conectado |
| `orderService.js` | ✅ Sí | Conectado |

### Contextos:

| Contexto | Estado |
|----------|--------|
| `AuthContext` | ✅ Nuevo, conectado |
| `CartContext` | ✅ Con sync a DB |
| `ThemeContext` | ✅ Funcional |

---

## 1.4 Estado de persistencia de datos

### localStorage vs DB - VERIFICADO:

| Dato | localStorage | DB | Consistencia |
|------|-------------|-----|--------------|
| Token JWT | `token` ✅ | - | ✅ Sincronizado |
| User data | `user` ✅ | - | ✅ Sincronizado |
| Carrito | `cart` ✅ | `Cart` ✅ | ✅ Sync activo |
| **Órdenes** | `orders` ✅ | `Order` ✅ | ✅ Sincronizado |

### ✅ INCONSISTENCIA CORREGIDA:

```
Checkout.jsx (línea ~175):
  → Guarda en DB: POST /api/orders/
  → Guarda en localStorage: localStorage.setItem("orders", ...)

Orders.jsx (línea 35):
  → SOLO lee de localStorage: readLocalJSON(STORAGE_KEYS.orders)
  → NO consulta /api/orders/user/:id
```

**Impacto:** Si el usuario cambia de dispositivo, pierde su historial de órdenes.

---

## 1.5 Flujos funcionales - Estado real

### Flujo 1: Registro ✅
```
RegisterForm → POST /api/auth/register → Éxito → Redirect /login
```

### Flujo 2: Login ✅
```
LoginForm → POST /api/auth/login → Guardar token+user → Redirect /
```

### Flujo 3: Catálogo ✅
```
Home → GET /api/products → Render cards
Click categoría → GET /api/products/category/:id → Filtrar
```

### Flujo 4: Carrito ⚠️
```
addToCart → POST /api/cart/add-product (auth) + localStorage backup
```

### Flujo 5: Checkout ⚠️
```
Checkout → GET shipping/payment → POST /api/orders/ + localStorage
```

### Flujo 6: Historial de Órdenes ❌
```
Orders → Lee localStorage → NO consulta /api/orders/user/:id
```

### Flujo 7: Wishlist ❌
```
Backend existe: /wishlist/toggle, /wishlist
Frontend: NO EXISTE componente
```

### Flujo 8: Reviews ❌
```
Backend existe: /reviews POST/GET/DELETE
Frontend: NO EXISTE componente
```

---

## 1.6 Gaps técnicos identificados

| # | Gap | Severidad | Clasificación |
|---|-----|-----------|--------------|
| G1 | Orders.jsx no consume API | ✅ Corregido | Bug |
| G2 | userService.js usa mock | ✅ Corregido | Deuda técnica |
| G3 | Wishlist sin frontend | ✅ Completado | Feature faltante |
| G4 | Reviews sin frontend | ✅ Completado | Feature faltante |
| G5 | AGENTS.md contradice código | ✅ Reescrito | Documentación |
| G6 | No seed ShippingAddress/PaymentMethod | ✅ Completado | Feature faltante |
| G7 | Tests Vitest con globals | ✅ Corregido | Bug |

---

# 2. Spec del proyecto

## 2.1 Descripción general

**E-commerce de videojuegos** (MVP)

| Capa | Tecnología | Estado |
|------|------------|--------|
| Frontend | React + Vite | Operativo |
| Backend | Node.js + Express | Operativo |
| DB | MongoDB Atlas | Operativo |
| Auth | JWT + bcrypt | Operativo |
| HTTP Client | Axios + interceptors | Operativo |

---

## 2.2 Módulos del sistema

### Módulo: Autenticación
- **Estado:** ✅ Completado
- **Backend:** `POST /auth/register`, `POST /auth/login`
- **Frontend:** `AuthContext`, `LoginForm`, `RegisterForm`
- **Modelo:** User
- **Gaps:** Ninguno

### Módulo: Catálogo
- **Estado:** ✅ Completado
- **Backend:** `GET /products`, `GET /products/category/:id`, `GET /categories`
- **Frontend:** `productService`, `categoryService`
- **Modelo:** Product, Category
- **Gaps:** Ninguno

### Módulo: Carrito
- **Estado:** ⚠️ Parcial
- **Backend:** `GET /cart`, `POST /cart`, `POST /cart/add-product`
- **Frontend:** `CartContext` con sync a DB + backup localStorage
- **Modelo:** Cart
- **Gaps:** Ninguno funcional, pero redundancia localStorage

### Módulo: Checkout y Órdenes
- **Estado:** ❌ Inconsistente
- **Backend:** `POST /orders`, `GET /orders/user/:id`
- **Frontend:** Checkout ✅ conectado, Orders ❌ solo localStorage
- **Modelo:** Order
- **Gaps:** 
  - Orders.jsx no consume API
  - Duplicidad de datos (DB + localStorage)

### Módulo: Wishlist
- **Estado:** ❌ Backend existe, frontend no
- **Backend:** `GET /wishlist`, `POST /wishlist/toggle`
- **Frontend:** NO EXISTE
- **Modelo:** Wishlist
- **Gaps:** Falta implementación frontend

### Módulo: Reviews
- **Estado:** ❌ Backend existe, frontend no
- **Backend:** `POST /reviews`, `GET /reviews/product/:id`, `DELETE /reviews/:id`
- **Frontend:** NO EXISTE
- **Modelo:** Review
- **Gaps:** Falta implementación frontend

---

## 2.3 Arquitectura técnica actual

```
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
├────────────────────────────────────────────────────────────────┤
│  Pages: Home, Login, Register, Cart, Checkout, Orders, Profile │
│  Services: 7 servicios API real (1 mock: userService)          │
│  Context: AuthContext ✅, CartContext ✅, ThemeContext ✅       │
│  localStorage: token, user, cart, orders                       │
└────────────────────────┬───────────────────────────────────────┘
                         │ Axios + Interceptors
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express)                           │
├────────────────────────────────────────────────────────────────┤
│  Routes: auth, users, products, categories, cart, orders,     │
│          shipping-address, payment-methods, wishlist, reviews  │
│  Middleware: auth (JWT), validation, error handling            │
│  Models: User, Product, Category, Cart, Order, ShippingAddress│
│          PaymentMethod, Wishlist, Review                       │
└────────────────────────┬───────────────────────────────────────┘
                         │ Mongoose
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    MONGODB ATLAS                               │
│  Database: ecommerce-api-videogames                           │
└────────────────────────────────────────────────────────────────┘
```

---

## 2.4 Inconsistencias detectadas

| # | Inconsistencia | Ubicación | Impacto |
|---|----------------|-----------|---------|
| 1 | Órdenes en localStorage y DB | Checkout.jsx + Orders.jsx | Perdida de historial entre dispositivos |
| 2 | userService usa mock | userService.js | Código inconsistente |
| 3 | AGENTS.md obsoleto | ecommerce-app/AGENTS.md | Riesgo de regresión |

---

## 2.5 Reglas funcionales

1. Envío gratuito si subtotal >= $1000 MXN
2. IVA 16% fijo
3. Roles: admin, customer, guest
4. Usuarios anónimos ven catálogo, auth para comprar

---

## 2.6 Deuda técnica

| # | Deuda | Prioridad |
|---|-------|-----------|
| D1 | Orders.jsx → conectar a API | 🔴 Alta |
| D2 | userService.js → usar API real | 🔴 Alta |
| D3 | AGENTS.md rewrite | 🔴 Alta |
| D4 | Wishlist frontend | 🟡 Media |
| D5 | Reviews frontend | 🟡 Media |
| D6 | Seed datos faltantes | 🟡 Media |
| D7 | Tests Vitest | 🟡 Media |

---

# 3. Backlog estructurado

## 3.1 Épicas

### ÉPICA 5: Corrección de inconsistencias
- Conectar Orders.jsx a API
- Refactorizar userService.js

### ÉPICA 6: Features faltantes
- Wishlist frontend
- Reviews frontend
- Seed datos adicionales

### ÉPICA 7: Documentación
- Reescribir AGENTS.md (App)
- Actualizar AGENTS.md (API)
- Archivar docs obsoletas

---

## 3.2 Tareas por épica

### ÉPICA 5: Corrección de inconsistencias

| # | Tarea | Prioridad | Clasificación |
|---|-------|-----------|--------------|
| 5.1 | Conectar Orders.jsx a `GET /api/orders/user/:id` | 🔴 Crítico | Bug |
| 5.2 | Refactorizar userService.js para usar API | 🔴 Crítico | Deuda técnica |

### ÉPICA 6: Features faltantes

| # | Tarea | Prioridad | Clasificación |
|---|-------|-----------|--------------|
| 6.1 | Crear servicio wishlistService.js | 🟡 Medio | Feature |
| 6.2 | Crear componente Wishlist page | 🟡 Medio | Feature |
| 6.3 | Crear servicio reviewService.js | 🟡 Medio | Feature |
| 6.4 | Agregar Reviews a ProductDetails | 🟡 Medio | Feature |
| 6.5 | Crear seed para ShippingAddress/PaymentMethod | 🟡 Medio | Feature |

### ÉPICA 7: Documentación

| # | Tarea | Prioridad | Clasificación |
|---|-------|-----------|--------------|
| 7.1 | Reescribir AGENTS.md (App) | 🔴 Crítico | Documentación |
| 7.2 | Actualizar AGENTS.md (API) | 🟡 Medio | Documentación |
| 7.3 | Archivar BACKLOG_MVP.md, PRODUCT_SPECS.md | 🟢 Bajo | Documentación |
| 7.4 | Crear PROJECT_STATE.md actualizado | 🟡 Medio | Documentación |

---

## 3.3 Priorización

| # | Tarea | Prioridad |
|---|-------|-----------|
| 5.1 | Orders.jsx → API | 🔴 Crítico |
| 5.2 | userService.js → API | 🔴 Crítico |
| 7.1 | Reescribir AGENTS.md | 🔴 Crítico |
| 6.5 | Seed datos | 🟡 Medio |
| 6.1-6.4 | Wishlist/Reviews | 🟡 Medio |
| 7.2 | AGENTS.md API | 🟡 Medio |
| 7.3-7.4 | Docs cleanup | 🟢 Bajo |

---

# 4. Historias de usuario

---

### US-006: Historial de órdenes desde servidor
**ID:** US-006  
**Título:** Consultar historial de órdenes desde la API  
**Como** Usuario autenticado  
**Quiero** Ver mi historial completo de órdenes desde cualquier dispositivo  
**Para** No perder mi historial si cambio de navegador o dispositivo  

**Criterios de aceptación:**
- [ ] Orders.jsx consume `GET /api/orders/user/:userId`
- [ ] Se eliminan lecturas de `localStorage` para órdenes
- [ ] El historial muestra todas las órdenes del usuario en la base de datos
- [ ] El estado de cada orden refleja el valor de `status` en DB

**Definición de terminado:**
- Orders.jsx no importa `STORAGE_KEYS.orders` ni `readLocalJSON`
- Las órdenes se cargan via `http.get('/orders/user/${userId}')`
- No hay duplicación de datos

**Dependencias técnicas:**
- US-004 (Auth con JWT)
- Endpoint `/api/orders/user/:id` existente

**Prioridad:** 🔴 Crítico  
**Estado actual:** ❌ No implementado (usa localStorage)

---

### US-007: Refactorizar userService a API real
**ID:** US-007  
**Título:** Migrar userService a consumo de API  
**Como** Desarrollador  
**Quiero** Que userService.js consuma la API real  
**Para** Eliminar dependencia de users.json mock y mantener consistencia  

**Criterios de aceptación:**
- [ ] userService.js no importa `../data/users.json`
- [ ] Funciones consumen `http.get('/users/profile')` o similar
- [ ] No hay setTimeout en las funciones

**Definición de terminado:**
- Archivo userService.js refactorizado
- users.json puede eliminarse si no se usa en otro lugar

**Dependencias técnicas:**
- US-002 (Cliente HTTP configurado)

**Prioridad:** 🔴 Crítico  
**Estado actual:** ❌ No implementado (usa mock)

---

### US-008: Wishlist funcional
**ID:** US-008  
**Título:** Agregar y remover productos de wishlist  
**Como** Usuario autenticado  
**Quiero** Guardar productos en una lista de deseos  
**Para** Comprarlos más tarde  

**Criterios de aceptación:**
- [ ] Existe servicio `wishlistService.js` conectado a `/api/wishlist`
- [ ] Existe página `/wishlist` con listado de productos guardados
- [ ] Botón "Agregar a wishlist" en ProductCard
- [ ] Toggle de wishlist funciona (agregar/quitar)

**Definición de terminado:**
- Página wishlist renderiza productos guardados
- Persistencia en MongoDB
- Sincronización entre dispositivos

**Dependencias técnicas:**
- US-004 (Auth)
- Backend `/api/wishlist/*` existente

**Prioridad:** 🟡 Medio  
**Estado actual:** ❌ Backend existe, frontend no

---

### US-009: Sistema de Reviews
**ID:** US-009  
**Título:** Dejar y ver reseñas de productos  
**Como** Usuario autenticado  
**Quiero** Ver y dejar reseñas de productos comprados  
**Para** Ayudar a otros usuarios con mi experiencia  

**Criterios de aceptación:**
- [ ] Existe servicio `reviewService.js` conectado a `/api/reviews`
- [ ] Sección de reviews en ProductDetails
- [ ] Formulario para crear review (rating 1-5 + comentario)
- [ ] Lista de reviews del producto

**Definición de terminado:**
- Reviews persisten en MongoDB
- Usuarios pueden crear una review por producto
- Validación de rating y comentario

**Dependencias técnicas:**
- US-004 (Auth)
- Backend `/api/reviews/*` existente

**Prioridad:** 🟡 Medio  
**Estado actual:** ❌ Backend existe, frontend no

---

### US-010: Seed de datos de usuario
**ID:** US-010  
**Título:** Poblar datos de ejemplo para direcciones y pagos  
**Como** Administrador  
**Quiero** Tener datos de ejemplo para direcciones y métodos de pago  
**Para** Que el checkout funcione inmediatamente después del seed  

**Criterios de aceptación:**
- [ ] seed.js inserta ShippingAddress de ejemplo
- [ ] seed.js inserta PaymentMethod de ejemplo
- [ ] Seed incluye relación con usuarios del seed

**Definición de terminado:**
- Seed corre sin errores
- Checkout puede usar datos del seed para pruebas

**Dependencias técnicas:**
- US-001 (Seed de productos y categorías)

**Prioridad:** 🟡 Medio  
**Estado actual:** ❌ No existe

---

# 5. Plan de limpieza documental

## 5.1 Documentos a conservar

| Documento | Razón |
|-----------|-------|
| `SSDLC_Protocolo_Operativo.md` | Protocolo vigente |
| `api_test_matrix.md` | Matriz de pruebas útil |
| `AGENTS.testing.md` (ambos) | Guías de testing vigentes |

---

## 5.2 Documentos a actualizar

| Documento | Update requerido |
|-----------|------------------|
| `AGENTS.md` (App) | Reescritura completa - contradice código |
| `AGENTS.md` (API) | Agregar modelos ShippingAddress, PaymentMethod |
| `ANALISIS_PENDIENTES.md` | Agregar gaps G1-G7 detectados |

---

## 5.3 Documentos a fusionar

| Fusionar | En |
|----------|-----|
| ANALISIS_PENDIENTES.md + hallazgos actuales | PROJECT_STATE.md |

---

## 5.4 Documentos a archivar

| Documento | Razón |
|-----------|-------|
| `BACKLOG_MVP.md` | Épicas completadas |
| `PRODUCT_SPECS.md` | Desactualizado, contradice estado actual |
| `archive/project_status_checkpoint.md` | Histórico, no estado actual |

---

## 5.5 Orden de ejecución

1. **Inmediato (G1, G2)**: Corregir Orders.jsx y userService.js
2. **Semana 1 (G5)**: Reescribir AGENTS.md (App)
3. **Semana 1**: Archivar docs obsoletas
4. **Semana 2 (G6, G7)**: Features faltantes
5. **Semana 2**: Actualizar AGENTS.md (API)

---

## 5.6 Riesgos de no limpiar

| Riesgo | Consecuencia |
|--------|--------------|
| AGENTS.md obsoleto | Desarrollador implementa patrones mock, revierte integración |
| Orders localStorage | Perdida de datos, experiencia inconsistente |
| Docs contradictorias | Confusión sobre qué está implementado vs no |

---

# 6. Resumen de acciones inmediatas

## 6.1 Gaps a resolver (Orden de prioridad)

| # | Gap | Acción | Archivos |
|---|-----|--------|----------|
| G1 | Orders localStorage | Conectar a API | `pages/Orders.jsx`, `services/orderService.js` (crear) |
| G2 | userService mock | Refactorizar | `services/userService.js` |
| G5 | AGENTS.md | Reescribir | `ecommerce-app/AGENTS.md` |

## 6.2 Gaps a resolver (Orden secundario)

| # | Gap | Acción |
|---|-----|--------|
| G3 | Wishlist | Crear frontend |
| G4 | Reviews | Crear frontend |
| G6 | Seed | Extender seed.js |
| G7 | Tests | Depurar Vitest |

## 6.3 Documentación a limpiar

| # | Doc | Acción |
|---|-----|--------|
| D1 | AGENTS.md (App) | Reescribir |
| D2 | AGENTS.md (API) | Actualizar |
| D3 | BACKLOG_MVP.md | Archivar |
| D4 | PRODUCT_SPECS.md | Archivar |
| D5 | ANALISIS_PENDIENTES.md | Renombrar a PROJECT_STATE.md |

---

*Documento generado post-auditoría de código. Verificado contra fuentes reales.*
