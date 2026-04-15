# Análisis de Pasos Pendientes - Post-Épica 3

Este documento resume el estado técnico del proyecto tras la integración exitosa de la Autenticación Real (US-004) y define la hoja de ruta para las siguientes fases.

## 🏁 Estado Actual: Épica 3 Completada
- [x] Conexión de `LoginForm` y `RegisterForm` con la API real de MongoDB Atlas.
- [x] Implementación de manejo de errores `try/catch` dinámico en el Frontend.
- [x] Eliminación de mocks de usuarios en dura (`users.json`).
- [x] Sincronización completa con el repositorio GitHub (rama `develop`).

---

## 🚀 Próximas Épicas (Hoja de Ruta)

### 1. ÉPICA 4: Transaccionalidad Segura (Carrito & Checkout)
**Prioridad:** 🔴 Muy Alta
- **Desafío:** El carrito actualmente depende excesivamente de `localStorage`.
- **Acción:** Sincronizar el `CartContext` con `GET /api/cart` y `POST /api/cart/add-product` usando los `_id` reales de los productos.
- **Acción:** Modificar `Checkout.jsx` para que el cálculo de totales, impuestos y envío ocurra **exclusivamente** en el Backend.

### 2. ÉPICA 5: Gestión de Perfil y Órdenes
**Prioridad:** 🔴 Alta
- **Desafío:** `Orders.jsx` debe consumir la API real (`/api/orders/user/:id`) en lugar de `localStorage`.
- **Acción:** Refactorizar el componente `Orders` para listar pedidos desde la base de datos.
- **Acción:** Integrar `userService.js` completamente con los endpoints de perfil.

### 3. ÉPICA 6: UI de Soporte (Wishlist & Reviews)
**Prioridad:** 🟡 Media
- **Desafío:** Los endpoints ya existen en el Backend pero no tienen interfaz.
- **Acción:** Crear la página `Wishlist.jsx`.
- **Acción:** Integrar el componente de Reseñas en `ProductDetails.jsx`.

---

## ⚠️ Observación sobre Ambiente de Producción (Render)
Se detectó un timeout persistente en la URL `https://two025-react-integration-march.onrender.com`. 
**Acción Recomendada:**
1. Verificar si el servicio está en "Hibernación" (Free Tier).
2. Validar que la variable de entorno `REACT_APP_API_URL` en Render apunte a la API correspondiente.
