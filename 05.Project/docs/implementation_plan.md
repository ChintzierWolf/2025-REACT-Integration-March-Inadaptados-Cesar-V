# Plan de Implementación de Pruebas Automatizadas (QA)

Este plan define la estrategia arquitectónica y técnica para implementar la suite de pruebas automatizadas del proyecto `ecommerce-api`, asegurando la máxima cobertura y fiabilidad.

## 🎯 Objetivos de Calidad

1.  **Cobertura de Código**: Alcanzar un mínimo de **85%** de cobertura global y **95%** en los módulos de autenticación y transacciones (`authController`, `orderController`).
2.  **Aislamiento**: Las pruebas unitarias no deben depender de la Base de Datos real ni de servicios externos. Mocks estrictos.
3.  **Rendimiento**: La suite completa debe ejecutarse en menos de 2 minutos para no bloquear el CI/CD.

## 🏗️ Arquitectura de la Suite de Pruebas

Se utilizará **Vitest** como motor de pruebas debido a su velocidad y soporte nativo para ES Modules.

### 1. Pruebas Unitarias (Controllers)

Se enfocan exclusivamente en la lógica de negocio, asumiendo que el middleware de Express ya hizo su trabajo.

- **Mocking**: Se usarán las funciones `vi.mock()` de Vitest para interceptar cualquier llamada a Mongoose (`User.findOne`, `Product.create`, etc.).
- **Helpers**: Se utilizará el factory `createMockReqRes` para simular los objetos de Express sin levantar un servidor http.

### 2. Pruebas de Integración (Routes & Middlewares)

Valida que la "tubería" de Express (Ruta -> Middleware de Auth -> Middleware de Validación -> Controller) funciona en conjunto.

- **Herramienta**: `supertest`. Levanta una instancia en memoria de Express para cada test.
- **Base de Datos**: Se utilizará `mongodb-memory-server` para levantar una base de datos efímera en memoria. Esto permite probar consultas reales sin afectar entornos de desarrollo o producción.

## 🗂️ Estructura de Directorios para Tests

```text
ecommerce-api/
├── tests/
│   ├── setup.js              # Configuración global de Vitest y MongoDB en memoria
│   ├── helpers.js            # createMockReqRes, generadores de JWT falsos, data factories
│   ├── unit/
│   │   ├── controllers/      # authController.test.js, userController.test.js...
│   │   ├── middlewares/      # authMiddleware.test.js, validation.test.js...
│   │   └── models/           # Pruebas de virtuals y métodos estáticos de Mongoose
│   └── integration/
│       ├── auth.test.js      # Peticiones Supertest a /api/auth/*
│       ├── users.test.js     # Peticiones Supertest a /api/users/*
│       ├── products.test.js  # Peticiones Supertest a /api/products/*
│       └── orders.test.js    # Peticiones Supertest a /api/orders/*
└── vitest.config.js          # Configuración de coverage y setupFiles
```

## 🚀 Fases de Implementación

### Fase 1: Infraestructura Base

- [x] Instalar dependencias (`vitest`, `supertest`, `mongodb-memory-server`, `@vitest/coverage-v8`).
- [x] Configurar `vitest.config.js`.
- [x] Crear `tests/helpers.js` y el setup de DB en memoria.

### Fase 2: Pruebas Unitarias Críticas

- [x] `authController.js` (Login y Registro).
- [x] `middlewares/auth.js` e `isAdminMiddleware.js`.
- [x] `orderController.js` (Especial atención al cálculo de totales y stock).

### Fase 3: Pruebas de Integración (Supertest)

- [x] Endpoints de Autenticación (`/api/auth/*`).
- [x] Endpoints de CRUD de Productos (`/api/products/*`).
- [x] Endpoints de Usuarios (Perfiles y Admin) (`/api/users/*`).
- [x] Flujo completo de Órdenes (`/api/orders/*`).

### Fase 4: Integración Continua (CI)

- [x] Configurar GitHub Actions (o similar) para ejecutar `npm run test` y `npm run coverage` en cada Pull Request hacia `main`.
- [x] Desplegar reportes de cobertura.

## ⚠️ Reglas Generales de Construcción de Tests

1.  **Dumb Tests**: Un test no debe contener lógica compleja (sin `if` o bucles `for` dinámicos). Si un test tiene lógica compleja, está mal diseñado.
2.  **AAA Pattern**: Todo test debe seguir la convención Arrange (Preparar), Act (Actuar), Assert (Afirmar). Separar visualmente cada fase.
3.  **Independencia Total**: El orden en el que se ejecutan los tests no debe importar. `beforeEach` siempre debe limpiar la DB o los mocks.
