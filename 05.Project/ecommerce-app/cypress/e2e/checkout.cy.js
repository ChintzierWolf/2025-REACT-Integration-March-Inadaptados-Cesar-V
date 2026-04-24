describe('Flujo de Checkout', () => {
  beforeEach(() => {
    // Establecer el estado de autenticación de Zustand y el token en localStorage usando cy.window()
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token-123');
      win.localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: {
            _id: '1',
            name: 'Usuario Test',
            email: 'demo@test.com',
            role: 'user'
          }
        },
        version: 0
      }));
    });
    
    // Interceptar la validación del perfil
    cy.intercept('GET', '**/api/users/profile', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Usuario Test',
        email: 'demo@test.com',
        role: 'user'
      }
    }).as('getProfile');

    // Interceptar el catálogo de productos
    cy.intercept('GET', '**/api/products', {
      statusCode: 200,
      body: [
        {
          _id: 'prod123',
          name: 'Producto de Prueba',
          price: 500,
          stock: 10,
          imagesUrl: ['/placeholder.jpg'],
          category: { _id: 'cat1', name: 'Categoria 1' }
        }
      ]
    }).as('getProducts');

    // Interceptar direcciones y métodos de pago del usuario
    cy.intercept('GET', '**/api/shipping-addresses', {
      statusCode: 200,
      body: [
        {
          _id: 'addr1',
          name: 'Casa',
          address: 'Av Principal 123',
          city: 'Ciudad',
          isDefault: true
        }
      ]
    }).as('getAddresses');

    cy.intercept('GET', '**/api/payment-methods/user/*', {
      statusCode: 200,
      body: [
        {
          _id: 'pay1',
          alias: 'Tarjeta Terminada en 1234',
          cardNumber: '**** **** **** 1234',
          isDefault: true
        }
      ]
    }).as('getPayments');

    // Interceptar creación de orden
    cy.intercept('POST', '**/api/orders', {
      statusCode: 201,
      body: {
        _id: 'order_789',
        status: 'pending',
        message: 'Orden creada exitosamente'
      }
    }).as('createOrder');

    // Interceptar llamadas al carrito
    cy.intercept('POST', '**/api/cart/add-product', {
      statusCode: 200,
      body: { message: 'Añadido al carrito' }
    }).as('addToCart');

    cy.intercept('GET', '**/api/cart/user/*', {
      statusCode: 200,
      body: { products: [] }
    }).as('getCart');
  });

  it('Permite añadir un producto al carrito y completar el checkout', () => {
    // 1. Visitar inicio y añadir producto al carrito
    cy.visit('/');
    cy.wait('@getProducts');
    
    // El data-testid se lo pusimos al botón del ProductCard
    cy.get('[data-testid="add-to-cart-prod123"]').click({ force: true });
    
    // Esperar a que la petición de backend finalice y Zustand guarde el estado
    cy.wait('@addToCart');

    // 2. Navegar al Checkout
    cy.visit('/checkout');
    
    cy.wait('@getAddresses');
    cy.wait('@getPayments');

    // 3. Confirmar la orden en el botón final
    cy.get('[data-testid="confirm-checkout"]').should('not.be.disabled').click({ force: true });
    
    cy.wait('@createOrder');

    // 4. Verificar redirección a página de confirmación
    cy.url().should('include', '/order-confirmation');
    cy.contains('¡Gracias por tu compra!').should('be.visible');
  });
});
