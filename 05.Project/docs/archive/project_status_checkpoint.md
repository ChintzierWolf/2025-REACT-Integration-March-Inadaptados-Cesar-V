## 🏁 Resumen de Cambios Efectuados (Sesión QA - 05 de Marzo de 2026)

### Calidad y Testing (`ecommerce-api`)

- **Infraestructura de Datos**: Se implementó el patrón _Data Builder_ en `tests/helpers.js` (`UserBuilder`, `ProductBuilder`, `OrderBuilder`) para agilizar la creación de datos de prueba.
- **Nuevos Tests de Integración**: Se crearon suites completas de pruebas para los módulos:
  - `review.test.js`: Creación, borrado seguro y prevención de duplicados.
  - `wishlist.test.js`: Toggle de productos y persistencia por usuario.
  - `shipping.test.js`: CRUD de direcciones de envío con aislamiento por usuario.
  - `cart.test.js`: Gestión de items, incremento de cantidad y borrado.
- **Matriz de Pruebas**: Se actualizó `docs/api_test_matrix.md` para incluir el 100% de los módulos actuales del backend.
- **Configuración Vitest**: Se habilitó `globals: true` en `vitest.config.js` y se estandarizó `tests/setup.js`.

### Estado de la Suite de Pruebas

- **[!] Nota Técnica**: Actualmente existe un problema de resolución de `globals` en el ambiente local que causa fallos de referencia en el hook `beforeAll` de `setup.js`. Los archivos de test son semánticamente correctos, pero el runner requiere un ajuste de dependencias/configuración adicional para ejecutarlos con éxito.

## 📂 Estado Actual de Git

- **Archivos Nuevos**: `tests/integration/{review,wishlist,shipping,cart}.test.js`.
- **Archivos Modificados**: `tests/helpers.js`, `tests/setup.js`, `vitest.config.js`, `docs/api_test_matrix.md`.

## 🚀 Próximos Pasos QA

1. **Debugging Environment**: Resolver la persistencia del `ReferenceError` en `setup.js` (posible conflicto de caché de Vitest o versiones de `v8`).
2. **Cobertura de Usuarios**: Fortalecer los tests de RBAC (Role-Based Access Control) en las rutas de administración.
3. **Frontend**: Iniciar las pruebas E2E paralelas en el frontend para validar la integración real.
