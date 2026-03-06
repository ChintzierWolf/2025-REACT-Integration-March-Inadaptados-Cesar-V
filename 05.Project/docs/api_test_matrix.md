# Matriz de Pruebas - API Ecommerce (Senior QA)

Esta matriz detalla los escenarios exactos que deben automatizarse para asegurar la estabilidad de la API. Cubre caminos felices, validaciones de esquema, reglas de negocio y seguridad.

## 🔐 1. Módulo: Autenticación (`/api/auth`)

| Endpoint    | Método | Escenario (Caso de Prueba)                 | Datos de Entrada (Arrange)                   | Resultado Esperado (Assert)                     | Tipo de Test |
| :---------- | :----- | :----------------------------------------- | :------------------------------------------- | :---------------------------------------------- | :----------- |
| `/register` | POST   | **Éxito**: Registro con datos válidos      | Email único, Pass válido, Nombre             | HTTP 201, Cíclico en DB, No devuelve hash       | Integración  |
| `/register` | POST   | **Error**: Email ya existe                 | Email de un usuario existente                | HTTP 400, "Email already in use"                | Unitaria/Int |
| `/register` | POST   | **Error Validaciones**: Esquema incorrecto | Faltan campos, Pass corto, Email mal formado | HTTP 422, Array de errores de express-validator | Integración  |
| `/login`    | POST   | **Éxito**: Login correcto                  | Email existente, Pass correcto               | HTTP 200, Retorna JWT válido y User Payload     | Unitaria/Int |
| `/login`    | POST   | **Error**: Email no registrado             | Email inexistente (`fake@fake.com`)          | HTTP 400/401, "Credenciales inválidas"          | Unitaria/Int |
| `/login`    | POST   | **Error**: Contraseña incorrecta           | Email existente, Pass erróneo                | HTTP 400/401, "Credenciales inválidas"          | Unitaria/Int |
| `/login`    | POST   | **Error**: Validaciones                    | Missing email o password en el body          | HTTP 422, Array de errores                      | Integración  |

## 👥 2. Módulo: Usuarios (`/api/users`)

| Endpoint       | Método | Escenario (Caso de Prueba)                   | Datos de Entrada (Arrange)                 | Resultado Esperado (Assert)                      | Tipo de Test |
| :------------- | :----- | :------------------------------------------- | :----------------------------------------- | :----------------------------------------------- | :----------- |
| `/profile`     | GET    | **Éxito**: Obtener perfil propio             | Header Auth con Token válido               | HTTP 200, Data del usuario (sin password)        | Unitaria/Int |
| `/profile`     | GET    | **Seguridad**: Sin token o Token expirado    | Petición sin Header Auth o Modificado      | HTTP 401, "No autorizado"                        | Integración  |
| `/profile`     | PUT    | **Éxito**: Actualizar nombre/teléfono        | Nuevo `displayName`, token propio          | HTTP 200, DB refleja cambios                     | Unitaria     |
| `/change-pass` | PUT    | **Éxito**: Cambio de contraseña              | `currentPassword` OK, `newPassword` válido | HTTP 200, Hash cambia en DB                      | Unitaria     |
| `/change-pass` | PUT    | **Regla de negocio**: Pass actual incorrecto | `currentPassword` erróneo                  | HTTP 400, "Current password is incorrect"        | Unitaria     |
| `/`            | GET    | **Autorización**: Admin lista usuarios       | Token con rol `admin`                      | HTTP 200, Array paginado de usuarios             | Integración  |
| `/`            | GET    | **Seguridad**: Cliente intenta listar        | Token con rol `customer`                   | HTTP 403, "Requiere privilegios de Admin"        | Integración  |
| `/:userId`     | DELETE | **Soft Delete**: Eliminar cuenta lógica      | Token Admin, ID válido, Usuario ACTIVO     | HTTP 200, `isActive` cambia a `false` (No borra) | Unitaria/Int |

## 📦 3. Módulo: Productos (`/api/products`)

| Endpoint | Método | Escenario (Caso de Prueba)              | Datos de Entrada (Arrange)                        | Resultado Esperado (Assert)                 | Tipo de Test |
| :------- | :----- | :-------------------------------------- | :------------------------------------------------ | :------------------------------------------ | :----------- |
| `/`      | GET    | **Éxito**: Listar con paginación        | `?page=1&limit=5`                                 | HTTP 200, Array len <= 5, Metadatos de pág. | Integración  |
| `/`      | GET    | **Filtros**: Búsqueda por parámetros    | `?genre=Action&platform=PC`                       | HTTP 200, Array filtrado según Query Params | Unitaria     |
| `/`      | POST   | **Éxito**: Crear producto               | Datos válidos (Posible Auth Admin necesaria)      | HTTP 201, Producto en DB, Retorna objeto    | Integración  |
| `/`      | POST   | **Error Validaciones**: Datos inválidos | Precio negativo, Categoría Inexistente, Stock < 0 | HTTP 422                                    | Integración  |
| `/:id`   | GET    | **Éxito**: Obtener detalle              | MongoId existente                                 | HTTP 200, Estructura del producto completa  | Unitaria     |
| `/:id`   | GET    | **Edge Case**: Mongo ID inválido        | `123123` (no 24 hex)                              | HTTP 400/422, "ID no válido"                | Integración  |
| `/:id`   | GET    | **Error**: ID válido pero no existe     | MongoId que no está en DB                         | HTTP 404, "Product not found"               | Unitaria     |
| `/:id`   | DELETE | **Éxito**: Eliminar producto            | MongoId existente, Auth Admin (?)                 | HTTP 200, Confirmación de borrado           | Integración  |

## 🛒 4. Módulo: Órdenes (`/api/orders`)

| Endpoint      | Método | Escenario (Caso de Prueba)               | Datos de Entrada (Arrange)                     | Resultado Esperado (Assert)                       | Tipo de Test |
| :------------ | :----- | :--------------------------------------- | :--------------------------------------------- | :------------------------------------------------ | :----------- |
| `/`           | POST   | **Éxito**: Crear orden                   | Array de productos, Direcciones, Pago. Auth OK | HTTP 201, Orden insertada, Status 'pending'       | Integración  |
| `/`           | POST   | **Lógica de BD**: Cálculo de totales     | Items por valor de $500 y $200                 | HTTP 201, `totalPrice` deber ser calculado autom. | Unitaria     |
| `/`           | POST   | **Validación**: Productos Vacíos         | `products: []`                                 | HTTP 400/422, "Order must contain products"       | Unitaria/Int |
| `/:id`        | GET    | **Aislamiento**: Ver orden propia        | Auth OK (creador de la orden)                  | HTTP 200, Detalles con populación de productos    | Integración  |
| `/:id`        | GET    | **Seguridad**: Ver orden de OTRO usuario | Auth con ID diferente al `order.user`          | HTTP 403, Acceso denegado (Solo dueño o admin)    | Integración  |
| `/:id/cancel` | PATCH  | **Éxito**: Cancelar orden en tiempo      | Estado previo 'pending' o 'processing'         | HTTP 200, Estado muta a 'cancelled'               | Unitaria     |
| `/:id/cancel` | PATCH  | **Regla Negocio**: Cancelar enviada      | Estado previo 'shipped' o 'delivered'          | HTTP 400, "Cannot cancel a shipped order"         | Unitaria     |
| `/`           | GET    | **Autorización**: Admin lista todo       | Token `admin`                                  | HTTP 200, Total de órdenes del sistema            | Integración  |

---

### Casos de Frontera (Edge Cases) y Crash Testing a cubrir:

1.  **Payloads excesivos**: Enviar un JSON de 10MB en `/auth/register` (Debe cortar Express limiter).
2.  **Inyección NoSQL**: Enviar `{ "$gt": "" }` en el input de `email` del Login (Vitest debe verificar sanitización).
3.  **Race Conditions de Stock** (Para Test de Carga/E2E Avanzado): Dos usuarios comprando simultáneamente el último producto disponible (Difícil con Supertest, requiere pruebas concurrentes `Promise.all()`).

---

## 🆕 5. Módulos Adicionales (Pendientes de Cobertura Completa)

Tras revisar el código fuente, se detectaron los siguientes módulos que requieren inclusión en la suite de automatización:

- **Cart**: Validación de adición/eliminación de items, cálculo en tiempo real.
- **Categories**: Creación por Admin, asignación a productos.
- **Reviews**: Flujo de calificación de 1-5, validación de compra previa.
- **Notifications & Payment Methods**: CRUD de métodos de pago y despacho de notificaciones de éxito/falla.
