describe('Flujo de Autenticación', () => {
  beforeEach(() => {
    // Interceptar la petición de login y simular éxito
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-12345',
        user: {
          _id: '1',
          displayName: 'Usuario Test',
          email: 'demo@test.com',
          role: 'user'
        }
      }
    }).as('loginSuccess');

    // Interceptar llamadas subsecuentes al perfil (inicialmente falla para permitir ver el login)
    cy.intercept('GET', '**/api/users/profile', {
      statusCode: 401,
      body: { error: 'No autorizado' }
    }).as('getProfile');

    cy.visit('/login');
  });

  it('Permite al usuario iniciar sesión y redirige al inicio', () => {
    cy.get('[data-testid="login-email"]').type('demo@test.com');
    cy.get('[data-testid="login-password"]').type('password123');
    
    // Cambiar la intercepción para que ahora sí devuelva el usuario válido
    cy.intercept('GET', '**/api/users/profile', {
      statusCode: 200,
      body: {
        _id: '1',
        displayName: 'Usuario Test',
        email: 'demo@test.com',
        role: 'user'
      }
    }).as('getProfileSuccess');

    cy.get('[data-testid="login-submit"]').click({ force: true });

    // Verifica que la petición de login fue interceptada
    cy.wait('@loginSuccess');

    // Verifica la redirección al inicio
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Verifica que el estado de autenticación cambió (ej. aparece el icono de usuario o el nombre)
    cy.contains('Usuario Test').should('exist');
  });

  it('Muestra error si el login falla', () => {
    // Sobrescribir interceptor para simular fallo
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { error: 'Credenciales inválidas' }
    }).as('loginFail');

    cy.get('[data-testid="login-email"]').type('wrong@test.com');
    cy.get('[data-testid="login-password"]').type('wrongpass');
    
    cy.get('[data-testid="login-submit"]').click({ force: true });

    cy.wait('@loginFail');

    // Verifica que aparece el mensaje de error en la UI
    cy.contains('Credenciales inválidas').should('be.visible');
  });
});
