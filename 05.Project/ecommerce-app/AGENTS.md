# Guía para Agentes - ecommerce-app

> **Estado:** Actualizado Marzo 2026  
> **Versión:** 2.0

Esta guía detalla la arquitectura, estándares y componentes del proyecto `ecommerce-app` para asegurar consistencia en el desarrollo del frontend.

---

## 📂 Estructura de Directorios (src/)

```
src/
├── components/         # Componentes de UI (App, Checkout, Common, etc.)
├── context/           # Contextos de React (Estado Global)
├── data/              # Datos simulados (Archivos .json - OBSOLETOS)
├── layout/            # Estructura visual base (Header, Footer, Nav)
├── pages/             # Componentes de página (Rutas principales)
├── services/          # Servicios API (Axios real)
├── styles/            # Estilos globales y variables CSS
└── utils/            # Funciones de ayuda (Auth, HTTP, storage)
```

---

## 🌐 Cliente HTTP (Axios)

El proyecto usa **Axios** con interceptores configurados en `src/utils/http.js`.

### Configuración base:

```javascript
import http from '../utils/http';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

### Interceptores:

1. **Request**: Inyecta automáticamente `Authorization: Bearer <token>` si existe en localStorage
2. **Response**: Desenvuelve `{ success: true, data: [...] }` automáticamente
3. **Error 401**: Limpia sesión y muestra error

### Uso típico:

```javascript
// GET
const products = await http.get('/products');

// POST
const order = await http.post('/orders/', orderData);

// Con autenticación (token inyectado automáticamente)
const profile = await http.get('/users/profile');
```

---

## 🧠 Gestión de Estado y Datos

El proyecto está migrando de una arquitectura basada en **Contextos de React** a una solución más escalable basada en **Zustand** (Estado Global) y **TanStack Query** (Datos Asíncronos).

### Zustand (Estado Global)
Utilizado para estados persistentes como la sesión del usuario y el carrito.
- **stores/authStore.js**: Maneja la autenticación y el usuario actual.
- **stores/cartStore.js**: Maneja los productos en el carrito y cálculos.

### TanStack Query (Estado Asíncrono)
Utilizado para el consumo de la API, manejo de caché y estados de carga.
- Se prefieren hooks personalizados (ej: `useProducts`) que encapsulen la lógica de `useQuery`.

### Contextos (Mantenimiento)
- `ThemeContext`: Se mantiene para el tema visual.
- Otros contextos están siendo marcados como obsoletos en favor de Zustand.

---

## 📡 Servicios API

Todos los servicios consumen la API real via Axios. **Ya no usan mocks ni setTimeout**.

### Servicios disponibles:

| Servicio | Archivo | Endpoints |
|----------|---------|-----------|
| Products | `productService.js` | GET /products, GET /products/category/:id |
| Categories | `categoryService.js` | GET /categories, GET /categories/:id |
| Auth | `utils/auth.js` | POST /auth/login, POST /auth/register |
| Cart | `cartService.js` | GET /cart, POST /cart/add-product |
| Orders | `orderService.js` | GET /orders/user/:id |
| Shipping | `shippingService.js` | GET /shipping-address, POST /shipping-address |
| Payment | `paymentService.js` | GET /payment-methods, POST /payment-methods |
| Address | `addressService.js` | CRUD direcciones |
| User | `userService.js` | GET /users/profile, PUT /users/profile |

### Ejemplo de uso:

```javascript
import { fetchProducts } from '../services/productService';
import { getOrders } from '../services/orderService';
import { getCurrentUser } from '../utils/auth';

const products = await fetchProducts();
const orders = await getOrders();
const user = getCurrentUser();
```

---

## 🧩 Componentes de `common/`

### Button

**Props:**
- `variant`: `'primary'`, `'secondary'`, `'outline'`, `'danger'`
- `size`: `'sm'`, `'lg'`
- `onClick`: Función handler
- `type`: `'button'`, `'submit'`, `'reset'`
- `disabled`: Booleano
- `className`: Clases adicionales
- `...props`: Atributos estándar de `<button>`

---

### Input

**Props:**
- `label`: Texto descriptivo sobre el input
- `type`: Tipo de input (text, email, password, etc.)
- `value`: Valor controlado
- `onChange`: Handler de cambio
- `placeholder`: Texto de ayuda
- `id`: ID único (si se omite, se genera uno aleatorio)
- `...rest`: Atributos adicionales

---

### Icon

**Props:**
- `name`: Nombre del icono (ej: `'cart'`, `'trash'`, `'chevronDown'`)
- `size`: Tamaño en píxeles (default: 20)
- `className`: Clases adicionales

---

### Loading / ErrorMessage

- **Loading**: Recibe `children` como texto de carga
- **ErrorMessage**: Recibe `children` como el mensaje de error a mostrar

---

### Badge

**Props:**
- `text`: Texto a mostrar
- `variant`: `'success'`, `'error'`, `'warning'`, `'info'`

---

## 🛒 Flujo de Checkout (`Checkout.jsx`)

1. **Carga de Datos**: Al montar, consulta `getShippingAddresses()` y `getPaymentMethods()`
2. **Sección 01 - Envío**: El usuario selecciona dirección o crea nueva
3. **Sección 02 - Pago**: El usuario selecciona método de pago o crea nuevo
4. **Sección 03 - Inventario**: Muestra vista previa del carrito (`CartView`)
5. **Cálculo Financiero**:
   - IVA: 16% (calculado en frontend para display)
   - Envío: $350 MXN (Gratis si subtotal >= $1000)
6. **Confirmación**: `POST /api/orders/` → limpia carrito → redirige a `/order-confirmation`

---

## 🔐 Flujo de Autenticación

### Login (`LoginForm.jsx`)
```
Form → POST /api/auth/login → Guardar token + user → Redirect /
```

### Registro (`RegisterForm.jsx`)
```
Form → POST /api/auth/register → Redirect /login
```

### AuthContext
```
Login → setUser + localStorage(token, user)
Logout → clearUser + localStorage.removeItem(token, user)
```

---

## 🚫 Restricciones para Agentes

1. **Prioridad de Estado**: Usar **Zustand** para estado global y **TanStack Query** para datos de API. EVITAR el uso de nuevos Contextos para estos propósitos.
2. **NO usar `require()`**: Usar siempre ESM (`import/export`)
3. **NO omitir el `alt` en imágenes**: Mantener accesibilidad básica
4. **NO modificar rutas sin actualizar App.jsx**: Asegurar que las nuevas páginas estén dentro de BrowserRouter
5. **NO usar datos mock en servicios**: Todos los servicios deben consumir `http.get/post/etc` de `../utils/http.js`
6. **NO guardar órdenes en localStorage**: El componente Orders consume `GET /api/orders/user/:id`
7. **Persistencia de sesión**: El token JWT se guarda en `localStorage` con key `'token'`

---

## 🔗 Integración Frontend-Backend

### Puerto del Backend
- **API**: `http://localhost:3000/api`
- **Frontend**: `http://localhost:4000`

### Variables de entorno (.env)
```
PORT=4000
REACT_APP_API_URL=http://localhost:3000/api
```

### Headers de autenticación
El interceptor de Axios inyecta automáticamente:
```
Authorization: Bearer <token_from_localStorage>
```

---

## 📁 Archivos OBSOLETOS (No usar)

| Archivo | Razón | Estado |
|---------|-------|--------|
| `src/data/users.json` | Datos mock de usuarios | Obsoleto - no se usa |
| `src/data/shipping-address.json` | Mock de direcciones | Obsoleto - no se usa |
| `src/data/paymentMethods.json` | Mock de pagos | Obsoleto - no se usa |

---

## 🧪 Testing (E2E)

Para detalles sobre cómo añadir Cypress, comandos personalizados y estructurar las pruebas End-to-End, revisa la guía específica:
[AGENTS.testing.md](./AGENTS.testing.md)

---

## 📝 Convenciones de Commits

Seguir Conventional Commits:

```
feat: nueva funcionalidad
fix: corrección de bug
refactor: mejora interna
docs: documentación
test: pruebas
chore: tareas de mantenimiento
```

---

*Última actualización: Marzo 2026 - Refleja estado post-integración*
