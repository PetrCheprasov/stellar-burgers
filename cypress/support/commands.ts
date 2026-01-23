/// <reference types="cypress" />
import { SELECTORS } from './selectors';

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
      addBun(bunName: string): Chainable<void>;
      addIngredient(ingredientName: string): Chainable<void>;
      switchToTab(tabName: string): Chainable<void>;
      openIngredientModal(ingredientName: string): Chainable<void>;
      closeModal(): Chainable<void>;
      checkModalVisible(): Chainable<void>;
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

Cypress.Commands.add('addBun', (bunName: string) => {
  cy.contains(bunName)
    .parent()
    .find('button')
    .contains(SELECTORS.BUTTON_ADD)
    .click();
});

Cypress.Commands.add('addIngredient', (ingredientName: string) => {
  cy.contains(ingredientName)
    .parent()
    .find('button')
    .contains(SELECTORS.BUTTON_ADD)
    .click();
});

Cypress.Commands.add('switchToTab', (tabName: string) => {
  cy.contains(tabName).click();
});

Cypress.Commands.add('openIngredientModal', (ingredientName: string) => {
  cy.contains(ingredientName)
    .parent()
    .find('a')
    .first()
    .click();
});

Cypress.Commands.add('closeModal', () => {
  cy.get(SELECTORS.MODAL_CONTAINER).find('button').first().should('be.visible').click();
});

Cypress.Commands.add('checkModalVisible', () => {
  cy.get(SELECTORS.MODAL_CONTAINER).should('exist');
  cy.get(SELECTORS.MODAL_CONTAINER).find('div').should('be.visible');
});

export {};