# Guía para Agentes - ecommerce-api

Esta guía detalla la arquitectura, estándares y patrones del proyecto `ecommerce-api` para asegurar consistencia en el desarrollo.

## 📂 Estructura de Directorios (src/)

```text
src/
├── config/             # Configuración (DB, variables de entorno)
├── controllers/        # Lógica de negocio de los endpoints
├── middlewares/        # Middlewares (Auth, Validaciones, Errores)
├── models/             # Modelos de Mongoose (Esquemas)
└── routes/             # Definición de rutas y aplicación de validaciones
```

## 🗺️ Mapa de Rutas API

Todas las rutas están prefijadas por `/api`.

| Recurso        | Método | Path                             | Auth | Admin |
| :------------- | :----- | :------------------------------- | :--: | :---: |
| **Auth**       | POST   | `/auth/register`                 |  ❌  |  ❌   |
|                | POST   | `/auth/login`                    |  ❌  |  ❌   |
| **Users**      | GET    | `/users/profile`                 |  ✅  |  ❌   |
|                | GET    | `/users/`                        |  ✅  |  ✅   |
|                | GET    | `/users/:userId`                 |  ✅  |  ✅   |
|                | PUT    | `/users/profile`                 |  ✅  |  ❌   |
|                | PUT    | `/users/change-password`         |  ✅  |  ❌   |
|                | PUT    | `/users/:userId`                 |  ✅  |  ✅   |
|                | PATCH  | `/users/deactivate`              |  ✅  |  ❌   |
|                | PATCH  | `/users/:userId/toggle-status`   |  ✅  |  ✅   |
|                | DELETE | `/users/:userId`                 |  ✅  |  ✅   |
| **Products**   | GET    | `/products/`                     |  ❌  |  ❌   |
|                | GET    | `/products/category/:idCategory` |  ❌  |  ❌   |
|                | POST   | `/products/`                     |  ❌  |  ❌   |
|                | PUT    | `/products/:id`                  |  ❌  |  ❌   |
|                | DELETE | `/products/:id`                  |  ❌  |  ❌   |
| **Orders**     | GET    | `/orders/`                       |  ✅  |  ✅   |
|                | GET    | `/orders/:id`                    |  ✅  |  ❌   |
|                | GET    | `/orders/user/:userId`           |  ✅  |  ❌   |
|                | POST   | `/orders/`                       |  ✅  |  ❌   |
|                | PATCH  | `/orders/:id/cancel`             |  ✅  |  ❌   |
|                | DELETE | `/orders/:id`                    |  ✅  |  ✅   |
| **Cart**       | GET    | `/cart/`                         |  ✅  |  ❌   |
|                | POST   | `/cart/`                         |  ✅  |  ❌   |
| **Categories** | GET    | `/categories/`                   |  ❌  |  ❌   |
|                | POST   | `/categories/`                   |  ✅  |  ✅   |
| **Notifs**     | GET    | `/notifications/`                |  ✅  |  ❌   |
| **Payments**   | GET    | `/payment-methods/`              |  ✅  |  ❌   |

## 🏗️ Modelos Mongoose (Principales)

### User

- `displayName` (String, Required)
- `email` (String, Required, Unique)
- `hashPassword` (String, Required)
- `role` (String, enum: ['admin', 'customer', 'guest'])
- `phone` (String, 10 digits)
- `isActive` (Boolean, default: true)

### Product

- `name` (String, Required)
- `price` (Number, Required)
- `stock` (Number, Required)
- `image` (String, Default placeholder)
- `category` (ObjectId -> Category)
- `platform` (enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'], Optional)
- `genre` (enum: ['Action', 'Adventure', 'RPG', ...], Optional)
- `releaseDate` (Date, Optional)

### Order

- `user` (ObjectId -> User)
- `products` (Array of {productId, quantity, price})
- `totalPrice` (Number)
- `status` (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])

### Cart

- `user` (ObjectId -> User)
- `products` (Array of {product: ObjectId, quantity: Number})

### Category

- `name` (String, Required)
- `description` (String)

### Review

- `user` (ObjectId -> User)
- `product` (ObjectId -> Product)
- `rating` (Number, 1 to 5)
- `comment` (String)

## ✅ Validaciones

El proyecto utiliza `express-validator`. Las validaciones se definen generalmente en el mismo archivo de rutas.

**Validadores comunes utilizados:**

- `body('field').isEmail()`
- `body('field').isLength({ min: X })`
- `body('field').isMongoId()`
- `body('field').isNumeric()`

## 📝 Patrones de Código

### Patrón de Controller (Standard)

Debe usar siempre `try/catch` y pasar el error a `next(error)`.

```javascript
const myController = async (req, res, next) => {
  try {
    const data = await MyModel.find();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
```

### Patrón de Ruta (con Auth y Validation)

Las validaciones se pasan como un array de middlewares antes del middleware `validate`.

```javascript
import { body } from "express-validator";
import validate from "../middlewares/validation.js";
import authMiddleware from "../middlewares/auth.js";

router.put(
  "/profile",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("displayName").notEmpty().withMessage("Nombre requerido"),
  ],
  validate,
  authMiddleware,
  myController,
);
```

## 🚫 Restricciones para Agentes

1.  **NO usar `require`**: El proyecto usa Módulos de ES (`import/export`).
2.  **NO crear nuevos contextos globales**: Mantener la lógica en controllers y servicios.
3.  **NO manejar errores con `res.send` en el catch**: Usar siempre `next(error)` para que el `errorHandler` global procese la respuesta.
4.  **NO modificar esquemas sin actualizar la documentación**: Si se agrega un campo a un modelo, debe reflejarse en este `AGENTS.md`.

## 🧪 Testing

Para detalles sobre cómo crear o modificar pruebas (Unitarias e Integración) usando **Vitest** y **Supertest**, revisa la guía específica:
[AGENTS.testing.md](./AGENTS.testing.md)
