# Guía para Agentes - Frontend (ecommerce-app)

Esta guía establece la arquitectura, estados y flujos para cualquier agente que trabaje en el frontend.

## Estructura de Directorios (src/)
- `src/components/`: Componentes organizados por funcionalidad (Atomic Design).
- `src/hooks/`: Hooks personalizados y de React Query.
- `src/pages/`: Vistas principales de la aplicación.
- `src/services/`: Clientes de API usando `http.js`.
- `src/stores/`: Gestión de estado con Zustand.
- `src/utils/`: Utilidades de formato, auth y constantes.

## Gestión de Estado (Zustand)

### `useAuthStore`
- `user`: Objeto con `_id`, `email`, `displayName`, `role`.
- `login(email, password)`: Realiza el login y guarda token.
- `logout()`: Limpia estado y localStorage.

### `useCartStore`
- `cartItems`: Array de productos.
- `total`: Suma total del carrito.
- `addToCart(product, quantity)`: Agrega item y sincroniza.

## Componentes Common (Props)
- `Button`: `variant`, `size`, `disabled`, `onClick`, `children`.
- `Icon`: `name`, `size`, `color`, `className`.
- `Badge`: `text`, `variant` (success, error, warning).

## Patrón de Servicio (http.js)
```javascript
import http from '../utils/http';

export const fetchData = async () => {
  return await http.get('/endpoint');
};
```

## Flujo de Checkout
1. **Validación**: Verifica que el carrito no esté vacío (si no, redirige a `/cart`).
2. **Dirección**: Selección o creación de dirección de envío.
3. **Pago**: Selección o creación de método de pago.
4. **Confirmación**: Envío de `orderData` al backend y redirección a éxito.

## Restricciones para Agentes
- **NO usar estilos inline**: Todo debe ir en archivos `.css` usando variables del tema.
- **NO usar `localStorage` directamente**: Usar los stores de Zustand persistidos.
- **NO ignorar Atomic Design**: Mantener componentes granulares y reutilizables.
- **NO usar librerías no instaladas**: Verificar `package.json` antes de importar.
