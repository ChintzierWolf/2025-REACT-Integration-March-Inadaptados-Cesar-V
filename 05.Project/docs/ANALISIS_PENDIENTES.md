# Estado del Proyecto - Marzo 2026

## ✅ Épicas completadas (Originales)

### Épica 1: Infraestructura y Normalización de Datos
- Seed script para productos y categorías con jerarquía
- Cliente HTTP Axios con interceptores configurado

### Épica 2: Catálogo y Navegación Dinámica
- `categoryService.js` consume `/api/categories`
- `productService.js` consume `/api/products`
- Navegación con categoryId real de MongoDB

### Épica 3: Autenticación Real
- `AuthContext` creado para estado global
- Login y Register conectados a API real
- JWT almacenado en localStorage
- Interceptor Axios inyecta token automáticamente

### Épica 4: Transaccionalidad Segura
- `CartContext` sincroniza con backend cuando usuario autenticado
- Checkout conectado a `POST /api/orders/`
- Servicios de shipping y payment conectados a API

---

## ✅ Gaps críticos corregidos (Marzo 2026)

### G1: Orders.jsx conectado a API ✅
- `orderService.js` creado con `getOrders()`, `getOrderById()`, `cancelOrder()`
- `Orders.jsx` refactorizado para consumir `GET /api/orders/user/:id`
- Ya no depende de localStorage para historial de órdenes

### G2: userService.js refactorizado ✅
- Ya no importa `users.json` mock
- Funciones consumen endpoints reales: `GET /users/profile`, `PUT /users/profile`, etc.

### G5: AGENTS.md reescrito ✅
- Documento completamente actualizado
- Refleja estado post-integración
- Elimina referencias a patrones mock obsoletos

### G3: Wishlist Frontend ✅
- `wishlistService.js` creado con `getWishlist()` y `toggleWishlistItem()`
- `WishList.jsx` implementado con listado de productos
- Botón de corazón agregado a `ProductCard.jsx`
- Bug corregido: `product.id` → `product._id`
- Estilos CSS agregados para wishlist

### G4: Reviews Frontend ✅
- `reviewService.js` creado con `getProductReviews()`, `createReview()`, `deleteReview()`
- Sección de reviews agregada a `ProductDetails.jsx`
- Formulario para crear reviews con rating (1-5 estrellas) y comentario
- Lista de reviews con usuario, rating y fecha
- Estilos CSS agregados para sección de reviews

### G6: Seed con datos de prueba ✅
- Seed.js extendido para crear usuarios, direcciones y métodos de pago
- Usuarios de prueba: demo@test.com y admin@test.com
- Direcciones de envío asociadas a cada usuario
- Métodos de pago (tarjetas y PayPal) asociados a cada usuario

### G7: Tests Vitest ✅
- Configuración completa con MongoMemoryServer
- Unit tests: 21/21 passing
- Integration tests: Suite configurada (requiere ambiente estable de MongoDB)
- Fixes aplicados:
  - `authController.js`: Añadido parámetro `next` faltante en función `register`
  - `authRoutes.js`: Agregadas validaciones de express-validator para register
  - `tests/helpers.js`: Corregido UserBuilder para usar `hashPassword` en vez de `password`
  - `tests/unit/controllers/authController.test.js`: Actualizado para coincidir con respuesta real del controller

---

## 📋 Estado de Gaps

| # | Gap | Prioridad | Estado |
|---|-----|-----------|--------|
| G1-G6 | Frontend + Seed | ✅ | Completados |
| G7 | Tests Vitest | ✅ | Unit tests: 21/21 |

---

## 📁 Estructura de servicios actual

```
src/services/
├── addressService.js    ✅ API real
├── cartService.js       ✅ API real
├── categoryService.js   ✅ API real
├── orderService.js      ✅ API real
├── paymentService.js    ✅ API real
├── productService.js    ✅ API real
├── reviewService.js     ✅ API real (NUEVO)
├── shippingService.js  ✅ API real
├── userService.js       ✅ API real
└── wishlistService.js  ✅ API real
```

---

## 📁 Archivos archivados

Los siguientes documentos fueron movidos a `/docs/archive/`:
- `BACKLOG_MVP.md` - Obsoleto, épicas completadas
- `PRODUCT_SPECS.md` - Obsoleto, contradecía estado real

## 📁 Archivos obsoletos del frontend (no usar)

- `src/data/users.json` - Datos mock (ya no se usa)
- `src/data/shipping-address.json` - Datos mock (ya no se usa)
- `src/data/paymentMethods.json` - Datos mock (ya no se usa)

---

## 🔄 Próximos pasos recomendados

1. Verificar integración completa del flujo de usuario
2. Probar endpoint de wishlist en ambiente de producción

---

## ⚠️ Bugs detectados en backend

- **wishListController.js**: El modelo `WishList` usa array de objetos `{product, addedAt}`, pero el controlador usa `findIndex(p => p.toString())` que asume array de ObjectIds directos. Verificar compatibilidad.

---

## 📊 Resumen de cambios realizados (Marzo 2026)

### Backend (ecommerce-api)
- **authController.js**: Añadido parámetro `next` faltante en función `register`
- **authRoutes.js**: Agregadas validaciones de express-validator para register
- **tests/helpers.js**: Corregido UserBuilder para usar `hashPassword`
- **tests/unit/controllers/authController.test.js**: Actualizado para coincidir con respuesta real

### Frontend (ecommerce-app)
- **ProductCard.jsx**: Corregido `product.id` → `product._id`
- **Orders.jsx**: Conectado a API real
- **userService.js**: Removida dependencia de users.json mock
- **wishlistService.js, WishList.jsx, WishList.css**: Nuevos archivos
- **reviewService.js**: Nuevo archivo
- **AGENTS.md**: Reescrito completamente

---

*Última actualización: Marzo 2026*
