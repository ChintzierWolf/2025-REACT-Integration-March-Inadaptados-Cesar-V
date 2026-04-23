# Guía para Agentes - Backend (ecommerce-api)

Esta guía establece la arquitectura, patrones y reglas para cualquier agente que trabaje en el backend.

## Estructura de Directorios (src/)
- `src/config/`: Configuraciones de DB, Swagger, etc.
- `src/controllers/`: Lógica de control de las rutas.
- `src/middlewares/`: Funciones intermedias (auth, validación, errores).
- `src/models/`: Definiciones de esquemas Mongoose.
- `src/routes/`: Definición de endpoints y asociación con controllers.
- `src/schemas/`: Esquemas de validación con Zod/Joi.
- `src/services/`: (Opcional) Lógica de negocio pesada.
- `app.js`: Punto de entrada y configuración de Express.

## Mapa de Rutas API

| Método | Path | Auth Requerido | Admin Requerido |
| :--- | :--- | :---: | :---: |
| POST | `/api/auth/register` | No | No |
| POST | `/api/auth/login` | No | No |
| GET | `/api/users/profile` | Sí | No |
| GET | `/api/products` | No | No |
| POST | `/api/products` | Sí | Sí |
| GET | `/api/products/:id` | No | No |
| GET | `/api/cart/user/:id` | Sí | No |
| POST | `/api/cart/add-product` | Sí | No |
| GET | `/api/orders/user/:userId` | Sí | No |
| POST | `/api/orders` | Sí | No |

## Modelos Mongoose Principales

### User
- `displayName`: String (requerido)
- `email`: String (requerido, único)
- `password`: String (requerido, hash)
- `role`: Enum ['user', 'admin']

### Product
- `name`: String (requerido)
- `description`: String
- `price`: Number (requerido)
- `stock`: Number (requerido)
- `imagesUrl`: Array de Strings
- `category`: ObjectId ref 'Category'

## Validadores Disponibles
Ubicados en `src/middlewares/validate.middleware.js` y `src/schemas/`:
- `validate`: Middleware genérico para ejecutar esquemas.
- `loginSchema`: Validación de credenciales.
- `registerSchema`: Registro de usuario.
- `addProductToCartSchema`: Validación de item para carrito.
- `createOrderSchema`: Estructura de orden de compra.

## Patrones de Código

### Controller (try/catch/next)
```javascript
async function getItems(req, res, next) {
  try {
    const items = await Model.find();
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
}
```

### Ruta (auth + validate)
```javascript
router.post('/', authMiddleware, validate(createItemSchema), controller.createItem);
```

## Restricciones para Agentes
- **NO usar `require`**: El proyecto usa Módulos ES (`import/export`).
- **NO crear contextos nuevos**: Usar la estructura de carpetas establecida.
- **NO omitir `next(error)`**: Siempre propagar errores al middleware global.
- **NO hardcodear secretos**: Usar `process.env`.
