import { SELECTORS } from '../support/selectors';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.setAuthTokens();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearAuthTokens();
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      cy.addBun(SELECTORS.BUN_NAME);
      cy.contains(SELECTORS.BUN_NAME_TOP).should('exist');
      cy.contains(SELECTORS.BUN_NAME_BOTTOM).should('exist');
    });

    it('должен добавить начинку в конструктор', () => {
      cy.switchToTab(SELECTORS.TAB_FILLINGS);
      cy.addIngredient(SELECTORS.INGREDIENT_NAME);
      cy.contains(SELECTORS.INGREDIENT_NAME).should('exist');
    });

    it('должен добавить булку и начинку в конструктор', () => {
      cy.addBun(SELECTORS.BUN_NAME);
      cy.switchToTab(SELECTORS.TAB_FILLINGS);
      cy.addIngredient(SELECTORS.INGREDIENT_NAME);
      cy.contains(SELECTORS.BUN_NAME_TOP).should('exist');
      cy.contains(SELECTORS.INGREDIENT_NAME).should('exist');
      cy.contains(SELECTORS.BUN_NAME_BOTTOM).should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открыть модальное окно при клике на ингредиент', () => {
      cy.openIngredientModal(SELECTORS.BUN_NAME);
      cy.url().should('include', `/ingredients/${SELECTORS.INGREDIENT_ID}`);
      cy.checkModalVisible();
      cy.contains(SELECTORS.BUN_NAME).should('be.visible');
    });

    it('должен закрыть модальное окно при клике на крестик', () => {
      cy.openIngredientModal(SELECTORS.BUN_NAME);
      cy.url().should('include', '/ingredients/');
      cy.get(SELECTORS.MODAL_CONTAINER).should('exist');
      cy.closeModal();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('должен закрыть модальное окно при клике на оверлей', () => {
      cy.openIngredientModal(SELECTORS.BUN_NAME);
      cy.url().should('include', '/ingredients/');
      cy.get(SELECTORS.MODAL_CONTAINER).should('exist');
      cy.get(SELECTORS.MODAL_CONTAINER).find('div').last().click({ force: true });
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Создание заказа', () => {
    it('должен создать заказ и показать модальное окно с номером заказа', () => {
      cy.addBun(SELECTORS.BUN_NAME);
      cy.switchToTab(SELECTORS.TAB_FILLINGS);
      cy.addIngredient(SELECTORS.INGREDIENT_NAME);
      cy.contains(SELECTORS.BUTTON_ORDER).click();
      cy.wait('@createOrder');
      cy.checkModalVisible();
      cy.contains(SELECTORS.ORDER_NUMBER).should('be.visible');
    });

    it('должен закрыть модальное окно заказа и очистить конструктор', () => {
      cy.addBun(SELECTORS.BUN_NAME);
      cy.switchToTab(SELECTORS.TAB_FILLINGS);
      cy.addIngredient(SELECTORS.INGREDIENT_NAME);
      cy.contains(SELECTORS.BUTTON_ORDER).click();
      cy.wait('@createOrder');
      cy.checkModalVisible();
      cy.closeModal();
      cy.get(SELECTORS.MODAL_CONTAINER).should('exist');
      cy.contains(SELECTORS.ORDER_NUMBER).should('not.exist');
      cy.contains(SELECTORS.PLACEHOLDER_BUNS).should('exist');
      cy.contains(SELECTORS.PLACEHOLDER_FILLINGS).should('exist');
    });
  });
});
