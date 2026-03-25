# Matriz de Pruebas Maestra - Ecommerce API

Como Senior QA, he diseñado esta matriz para cubrir el 100% de la superficie de ataque y funcionalidad de la API.

## 📑 Índice de Módulos
1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Productos y Categorías](#productos-y-categorías)
4. [Carrito de Compras](#carrito-de-compras)
5. [Órdenes y Pagos](#órdenes-y-pagos)
6. [Lista de Deseos y Reseñas](#lista-de-deseos-y-reseñas)
7. [Seguridad y Edge Cases](#seguridad-y-edge-cases)

---

### 🔐 Autenticación (`/api/auth`)
| ID | Escenario | Entrada | Resultado Esperado | Prioridad |
|:---|:---|:---|:---|:---|
| AUTH-01 | Registro Exitoso | JSON válido | 201 Created + User object (sin hash) | Crítica |
| AUTH-02 | Registro Duplicado | Email existente | 400 Bad Request | Alta |
| AUTH-03 | Login Exitoso | Credenciales OK | 200 OK + JWT Token | Crítica |
| AUTH-04 | Login Fallido | Pass incorrecto | 400/401 Unauthorized | Alta |
| AUTH-05 | Sanitización NoSQL | Query en body | 400 Bad Request/Sanitized | Media |

### 👥 Usuarios (`/api/users`)
| ID | Escenario | Entrada | Resultado Esperado | Prioridad |
|:---|:---|:---|:---|:---|
| USER-01 | Obtener Perfil | Token de Usuario | 200 OK + Datos privados | Alta |
| USER-02 | Ver Lista Usuarios | Token Admin | 200 OK + Array de usuarios | Media |
| USER-03 | Ver Lista Usuarios | Token Customer | 403 Forbidden | Alta |
| USER-04 | Deactivar Cuenta | Token propio | 200 OK + isActive: false | Alta |
| USER-05 | Cambio Pass | Correct current pass | 200 OK + Nuevo Hash en DB | Alta |

### 📦 Productos y Categorías (`/api/products`, `/api/categories`)
| ID | Escenario | Entrada | Resultado Esperado | Prioridad |
|:---|:---|:---|:---|:---|
| PROD-01 | Listar Productos | N/A | 200 OK + Paginación funcional | Alta |
| PROD-02 | Crear Producto | Token Admin + Datos | 201 Created | Alta |
| PROD-03 | Crear Producto | Token Customer | 403 Forbidden | Alta |
| CAT-01 | Ruta Redundante | `/api/categories/categories` | 200 OK (Bug de ruta detectado) | Baja |
| CAT-02 | Crear Categoría | Token Admin | 201 Created | Media |

### 🛒 Carrito de Compras (`/api/cart`)
| ID | Escenario | Entrada | Resultado Esperado | Prioridad |
|:---|:---|:---|:---|:---|
| CART-01 | Agregar Producto | ProductID + Qty | 200 OK + Carrito actualizado | Alta |
| CART-02 | Stock Insuficiente | Qty > Product Stock | 400 Bad Request | Crítica |
| CART-03 | Sync con DB | Token Auth | Carrito persiste al cerrar sesión | Alta |

### 📑 Órdenes y Pagos (`/api/orders`)
| ID | Escenario | Entrada | Resultado Esperado | Prioridad |
|:---|:---|:---|:---|:---|
| ORD-01 | Checkout Exitoso | Lista de items + Pago | 201 Created + Limpieza de Carrito | Crítica |
| ORD-02 | Ver Orden Ajena | Token de otro usuario | 403 Forbidden | Crítica |
| ORD-03 | Cancelar Orden | ID de orden 'pending' | 200 OK + Status 'cancelled' | Alta |
| ORD-04 | Cancelar Enviada | ID de orden 'shipped' | 400 Bad Request | Media |

### ❤️ Lista de Deseos y Reseñas (`/api/wishlists`, `/api/reviews`)
| ID | Escenario | Entrada | Resultado Esperado | Prioridad |
|:---|:---|:---|:---|:---|
| WISH-01 | Toggle Item (Add) | ProductID | 200/201 OK | Media |
| WISH-02 | Toggle Item (Remove) | ProductID existente | 200 OK | Media |
| REV-01 | Crear Reseña | Rating 1-5 + Comment | 201 Created | Media |
| REV-02 | Reseña Duplicada | Mismo user + producto | 400 Bad Request | Media |

### 🛡️ Seguridad y Edge Cases (Cross-cutting)
| ID | Escenario | Técnica | Resultado Esperado | Prioridad |
|:---|:---|:---|:---|:---|
| SEC-01 | Expiración Token | JWT Expirado | 401 Unauthorized | Crítica |
| SEC-02 | Rate Limiting | 1000 req/sec | 429 Too Many Requests | Alta |
| SEC-03 | Payload Limit | JSON > 1MB | 413 Payload Too Large | Alta |
| SEC-04 | ID Malformado | `/api/products/invalid-id` | 400 Bad Request (Validator) | Alta |
