/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to set auth tokens
       * @example cy.setAuthTokens()
       */
      setAuthTokens(): Chainable<void>;
      /**
       * Custom command to clear auth tokens
       * @example cy.clearAuthTokens()
       */
      clearAuthTokens(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('setAuthTokens', () => {
  const accessToken = 'fake-access-token';
  const refreshToken = 'fake-refresh-token';
  
  cy.setCookie('accessToken', accessToken);
  window.localStorage.setItem('refreshToken', refreshToken);
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.clearCookies();
  window.localStorage.clear();
});

export {};
