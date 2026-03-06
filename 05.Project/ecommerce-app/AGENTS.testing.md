# Guía de Testing E2E con Cypress - ecommerce-app

Esta guía establece los estándares y patrones para escribir pruebas End-to-End (E2E) en el frontend (`ecommerce-app`) usando **Cypress**.

## 🚀 Instalación y Configuración Básica

Cypress no está instalado por defecto en el proyecto. Para inicializarlo, el agente debe ejecutar:

```bash
npm install cypress -D
npx cypress open
```

_Nota: Si se ejecuta en un pipeline CI/CD, usar `npx cypress run`._

Asegúrate de configurar la base URL en `cypress.config.js`:

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

## 🛠️ Comandos Personalizados (`cypress/support/commands.js`)

Para evitar repetición en los tests, se deben implementar y utilizar los siguientes comandos personalizados:

### `cy.loginByApi()`

Evita usar la UI para iniciar sesión en cada test, inyectando directamente el estado en `localStorage` o llamando al endpoint real (si el backend está conectado).

```javascript
Cypress.Commands.add("loginByApi", (email = "cliente@email.com") => {
  // Simulando el login del utils/auth.js actual (Mock)
  const token = btoa(`${email}:${Date.now()}`);
  const user = { email, role: "cliente", name: "Usuario Prueba" };

  window.localStorage.setItem("authToken", token);
  window.localStorage.setItem("userData", JSON.stringify(user));
});
```

### `cy.addProductToCart()`

Navega a la página de un producto y lo añade al carrito, útil para preparar el estado antes del checkout.

```javascript
Cypress.Commands.add("addProductToCart", (productId) => {
  cy.visit(`/product/${productId}`);
  cy.get('[data-testid="add-to-cart-btn"]').should("be.visible").click();
  cy.get('[data-testid="cart-badge"]').should("contain", "1");
});
```

## 🧪 Ejemplos Completos de Tests

### 1. Flujo de Registro (Register)

_Nota: Actualmente el registro no está en UI, pero si se agrega, este es el patrón:_

```javascript
describe("Flujo de Registro", () => {
  it("debe registrar un usuario nuevo exitosamente", () => {
    cy.visit("/register");

    cy.get('[data-testid="register-name-input"]').type("Nuevo Usuario");
    cy.get('[data-testid="register-email-input"]').type("nuevo@test.com");
    cy.get('[data-testid="register-password-input"]').type("password123");

    cy.get('[data-testid="register-submit-btn"]').click();

    // Verificar redirección o mensaje de éxito
    cy.url().should("include", "/login");
    cy.contains("Registro exitoso").should("be.visible");
  });
});
```

### 2. Flujo de Login

```javascript
describe("Flujo de Login Front-End", () => {
  it("debe iniciar sesión exitosamente y redirigir al inicio", () => {
    cy.visit("/login");

    cy.get('[data-testid="login-email-input"]').type("cliente@email.com");
    cy.get('[data-testid="login-password-input"]').type("cliente123");

    cy.get('[data-testid="login-submit-btn"]').click();

    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.get('[data-testid="user-profile-menu"]').should("be.visible");
  });

  it("debe mostrar error con credenciales incorrectas", () => {
    cy.visit("/login");

    cy.get('[data-testid="login-email-input"]').type("invalido@email.com");
    cy.get('[data-testid="login-password-input"]').type("wrongpass");

    cy.get('[data-testid="login-submit-btn"]').click();

    cy.get('[data-testid="error-message"]').should("be.visible");
  });
});
```

### 3. Flujo Completo de Checkout (4 Fases)

Este test prueba el módulo de `Checkout.jsx` paso a paso.

```javascript
describe("Flujo de Checkout", () => {
  beforeEach(() => {
    // 1. Preparación del estado
    cy.loginByApi();
    cy.addProductToCart("prod_123"); // Asumiendo un ID válido
    cy.visit("/checkout");
  });

  it("debe completar una orden exitosamente eligiendo dirección y pago existentes", () => {
    // Fase 1: Coordenadas de Envío (Dirección)
    cy.get('[data-testid="address-module"]').click();
    cy.get('[data-testid="address-item-0"]').click(); // Seleccionar la primera

    // Fase 2: Método de Pago
    cy.get('[data-testid="payment-module"]').click();
    cy.get('[data-testid="payment-item-0"]').click(); // Seleccionar el primero

    // Fase 3: Inventario Seleccionado (Carrito)
    cy.get('[data-testid="checkout-cart-item"]').should(
      "have.length.at.least",
      1,
    );

    // Fase 4: Resumen y Confirmación
    cy.get('[data-testid="checkout-summary-total"]').should("not.be.empty");
    cy.get('[data-testid="confirm-order-btn"]')
      .should("not.be.disabled")
      .click();

    // Verificación final
    cy.url().should("include", "/order-confirmation");
    cy.get('[data-testid="order-success-message"]').should("be.visible");
  });
});
```

## 🏷️ Tabla de `data-testid` Requeridos

Para asegurar que los tests sean frágiles a cambios de CSS, todo componente interactivo o contenedor clave debe tener un atributo `data-testid`.

| Componente/Página | Elemento         | Atributo `data-testid` Requerido          |
| :---------------- | :--------------- | :---------------------------------------- |
| **Common**        | Input Genérico   | N/A (Se aplican a los inputs específicos) |
|                   | Botón Genérico   | N/A                                       |
|                   | ErrorMessage     | `error-message`                           |
|                   | Badge Carrito    | `cart-badge`                              |
| **Login**         | Input Email      | `login-email-input`                       |
|                   | Input Password   | `login-password-input`                    |
|                   | Botón Submit     | `login-submit-btn`                        |
| **Header/Nav**    | Menú Usuario     | `user-profile-menu`                       |
| **Product**       | Botón Agregar    | `add-to-cart-btn`                         |
| **Checkout**      | Módulo Dirección | `address-module`                          |
|                   | Item Dirección   | `address-item-{index}`                    |
|                   | Form Nueva Dir.  | `new-address-form`                        |
|                   | Módulo Pago      | `payment-module`                          |
|                   | Item Pago        | `payment-item-{index}`                    |
|                   | Item del Carrito | `checkout-cart-item`                      |
|                   | Total Resumen    | `checkout-summary-total`                  |
|                   | Botón Confirmar  | `confirm-order-btn`                       |
| **OrderConfirm**  | Mensaje Éxito    | `order-success-message`                   |

### Regla para el Agente

**Siempre** que edites o crees un componente visual interactivo, agrega el tag `data-testid` correspondiente antes de escribir el test de Cypress.
