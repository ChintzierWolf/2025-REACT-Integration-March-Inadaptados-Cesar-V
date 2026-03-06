# Guía para Agentes - ecommerce-app

Esta guía detalla la arquitectura, estándares y componentes del proyecto `ecommerce-app` para asegurar consistencia en el desarrollo del frontend.

## 📂 Estructura de Directorios (src/)

```text
src/
├── components/         # Componentes de UI (App, Checkout, Common, etc.)
├── context/            # Contextos de React (Estado Global)
├── data/               # Datos simulados (Archivos .json)
├── layout/             # Estructura visual base (Header, Footer, Nav)
├── pages/              # Componentes de página (Rutas principales)
├── services/           # Lógica de "peticiones" (Simuladas con delay)
├── styles/             # Estilos globales y variables CSS
└── utils/              # Funciones de ayuda (Auth, localStorage)
```

## 🧠 Contextos Disponibles

### CartContext (`useCart`)

Gestiona el carrito de compras y persiste en `localStorage`.
**Retorna:**

- `cartItems`: Array de objetos `{ _id, name, price, quantity, ... }`.
- `total`: Valor numérico del costo total.
- `addToCart(product, quantity)`: Agrega o incrementa cantidad.
- `removeFromCart(productId)`: Elimina un item por ID.
- `updateQuantity(productId, newQuantity)`: Cambia la cantidad exacta.
- `clearCart()`: Vacía el carrito.
- `getTotalItems()`: Retorna la cuenta total de productos (suma de cantidades).
- `getTotalPrice()`: Retorna el costo total calculado.

### ThemeContext (`useTheme`)

Gestiona el tema (claro/oscuro) de la aplicación.
**Retorna:**

- `theme`: `'light'` o `'dark'`.
- `isDarkMode`: Booleano descriptivo.
- `toggleTheme()`: Cambia entre temas.
- `setTheme(val)`: Establece el tema manualmente.

## 🧩 Componentes de `common/`

### Button

**Props:**

- `variant`: `'primary'`, `'secondary'`, `'outline'`, `'danger'`.
- `size`: `'sm'`, `'lg'`.
- `onClick`: Función handler.
- `type`: `'button'`, `'submit'`, `'reset'`.
- `disabled`: Booleano.
- `className`: Clases adicionales.
- `...props`: Atributos estándar de `<button>`.

### Input

**Props:**

- `label`: Texto descriptivo sobre el input.
- `type`: Tipo de input (text, email, password, etc.).
- `value`: Valor controlado.
- `onChange`: Handler de cambio.
- `placeholder`: Texto de ayuda.
- `id`: ID único (si se omite, se genera uno aleatorio).
- `...rest`: Atributos adicionales.

### Icon

**Props:**

- `name`: Nombre del icono (ej: `'cart'`, `'trash'`, `'chevronDown'`).
- `size`: Tamaño en píxeles (default: 20).
- `className`: Clases adicionales.

### Loading / ErrorMessage

- **Loading**: Recibe `children` como texto de carga.
- **ErrorMessage**: Recibe `children` como el mensaje de error a mostrar.

## 🛒 Flujo de Checkout (`Checkout.jsx`)

1.  **Carga de Datos**: Al montar, consulta servicios de direcciones y pagos (`getShippingAddresses`, `getPaymentMethods`).
2.  **Sección 01 - Envío**: El usuario selecciona una dirección de `AddressList` o crea una nueva con `AddressForm`.
3.  **Sección 02 - Pago**: El usuario selecciona un método de `PaymentList` o crea uno nuevo con `PaymentForm`.
4.  **Sección 03 - Inventario**: Muestra una vista previa del carrito (`CartView`).
5.  **Cálculo Financiero**:
    - IVA: 16% fijo.
    - Envío: $350 MXN (Gratis si subtotal >= $1000).
6.  **Confirmación**: Al hacer clic en "CONFIRMAR ORDEN", se guarda la orden en `localStorage` ("orders"), se limpia el carrito y se redirige a `/order-confirmation`.

## 🛠️ Patrón de Servicio (Mock)

Los servicios simulan llamadas a API usando los datos en `src/data/*.json`.
**Estructura:**

```javascript
import data from "../data/myResource.json";

export const fetchResource = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1500); // Latencia simulada
  });
};
```

## 🚫 Restricciones para Agentes

1.  **NO usar bibliotecas externas de estado**: Mantener la lógica en los Contextos existentes.
2.  **NO usar `require()`**: Usar siempre ESM (`import/export`).
3.  **NO omitir el `alt` en imágenes**: Mantener accesibilidad básica.
4.  **NO modificar rutas sin actualizar App.jsx**: Asegurar que las nuevas páginas estén dentro de `BrowserRouter`.
5.  **Persistencia**: Si se agrega un nuevo dato global, debe persistirse en `localStorage` siguiendo el patrón de los contextos actuales.

## 🧪 Testing (E2E)

Para detalles sobre cómo añadir Cypress, comandos personalizados y estructurar las pruebas End-to-End, revisa la guía específica:
[AGENTS.testing.md](./AGENTS.testing.md)
