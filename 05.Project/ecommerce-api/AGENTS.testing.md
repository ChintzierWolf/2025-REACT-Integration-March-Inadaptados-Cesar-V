# Guía de Testing con Vitest - ecommerce-api

Esta guía establece los estándares y patrones para escribir pruebas unitarias y de integración en el backend (`ecommerce-api`) usando **Vitest**.

## 🛠️ Configuración y Reglas Básicas

1.  **Sin variables globales**: Vitest está configurado sin `globals: true`. Siempre debes importar las funciones de pruebas explícitamente.
2.  **Ubicación de los tests**: Todos los archivos de prueba deben estar dentro de la carpeta `tests/` o junto al archivo modificado con la extensión `.test.js`.

```javascript
// ✅ Correcto: Importación explícita
import { describe, it, expect, vi, beforeEach } from "vitest";

// ❌ Incorrecto: Asumir que son globales
// describe('My Test', () => { ... })
```

## 🧪 Helper `createMockReqRes`

Para aislar los controladores, usamos un helper que simula los objetos `req`, `res` y la función `next` de Express. Este helper lo debes crear en `tests/helpers.js`.

```javascript
// tests/helpers.js
import { vi } from "vitest";

export const createMockReqRes = (overrides = {}) => {
  const req = {
    body: {},
    params: {},
    query: {},
    user: {},
    ...overrides,
  };

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };

  const next = vi.fn();

  return { req, res, next };
};
```

## 📦 Mockeando Modelos Mongoose

Debemos aislar la base de datos de los controladores usando los mocks de Vitest (`vi.mock`).

```javascript
import { describe, it, expect, vi } from "vitest";
import User from "../src/models/user.js"; // Ajusta la ruta a tu modelo

// Mockear todo el módulo del modelo
vi.mock("../src/models/user.js", () => {
  return {
    default: {
      findOne: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      // Añade los métodos de mongoose que necesites
    },
  };
});
```

Asegúrate de limpiar los mocks antes de cada test para evitar que el estado se filtre:

```javascript
beforeEach(() => {
  vi.clearAllMocks();
});
```

## 📝 Ejemplo Completo: `authController.test.js`

A continuación, un ejemplo de cómo probar el `register` y `login` asumiendo las funciones de controlador del proyecto.

```javascript
// tests/controllers/authController.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../src/models/user.js";
import { register, login } from "../../src/controllers/authController.js";
import { createMockReqRes } from "../helpers.js";

// Mocks
vi.mock("../../src/models/user.js");
vi.mock("bcrypt");
vi.mock("jsonwebtoken");

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register()", () => {
    it("debe registrar un usuario exitosamente", async () => {
      const { req, res, next } = createMockReqRes({
        body: {
          email: "test@test.com",
          password: "password123",
          name: "Test User",
        },
      });

      User.findOne.mockResolvedValue(null); // El usuario no existe
      bcrypt.hash.mockResolvedValue("hashed_password");

      // Simulamos la instancia del modelo User y su método save
      const mockSave = vi.fn().mockResolvedValue(true);
      User.mockImplementation(() => ({ save: mockSave }));

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
    });

    it("debe llamar a next(error) si el email ya existe", async () => {
      const { req, res, next } = createMockReqRes({
        body: { email: "test@test.com", password: "password123" },
      });

      User.findOne.mockResolvedValue({ email: "test@test.com" }); // Existe

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
      expect(next).not.toHaveBeenCalled(); // Si mandamos res.status no llamamos next
    });
  });

  describe("login()", () => {
    it("debe iniciar sesión y devolver un token", async () => {
      const { req, res, next } = createMockReqRes({
        body: { email: "test@test.com", password: "password123" },
      });

      const mockUser = {
        _id: "123",
        email: "test@test.com",
        hashPassword: "hashed_password",
        role: "customer",
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mocked_jwt_token");

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashed_password",
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "mocked_jwt_token",
        }),
      );
    });
  });
});
```

## ✅ Checklist de Casos Obligatorios por Endpoint

Para cada controlador/endpoint que desarrolles, debes escribir los siguientes tests **como mínimo**:

- [ ] **Happy Path (Camino Feliz):** Petición válida con todos los datos correctos. Verifica el status code (200/201) y la estructura de la respuesta.
- [ ] **Validación de Errores (400):** Proveer datos faltantes o incorrectos (email inválido, falta un campo). Valida que retorna error antes de consultar la DB.
- [ ] **Recurso no Encontrado (404):** Peticiones a IDs que no existen en la base de datos (Ej: `getUserById` con un ID falso).
- [ ] **Permisos/Autorización (401/403):** Intentar acceder a rutas protegidas sin token o con un rol insuficiente (Ej: `customer` accediendo a ruta de `admin`).
- [ ] **Manejo de Excepciones del Servidor (500):** Forzar un error en el mock (Ej: `User.findOne.mockRejectedValue(new Error('DB Error'))`) y verificar que se llame a `next(error)`.
