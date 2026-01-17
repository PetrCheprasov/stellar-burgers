describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запросы к API
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    // Устанавливаем токены авторизации
    cy.setAuthTokens();

    // Переходим на страницу конструктора
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем токены после каждого теста
    cy.clearAuthTokens();
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      // Находим первую булку и кликаем на кнопку "Добавить"
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должен добавить начинку в конструктор', () => {
      // Переключаемся на вкладку "Начинки"
      cy.contains('Начинки').click();

      // Находим начинку и добавляем её
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что начинка появилась в конструкторе
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });

    it('должен добавить булку и начинку в конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Переключаемся на вкладку "Начинки"
      cy.contains('Начинки').click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что оба ингредиента в конструкторе
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открыть модальное окно при клике на ингредиент', () => {
      // Кликаем на ингредиент (не на кнопку "Добавить")
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('a')
        .first()
        .click();

      // Проверяем, что модальное окно открылось через роутинг
      cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
      
      // Проверяем, что модальное окно появилось в DOM (#modals)
      cy.get('#modals').should('exist');
      cy.get('#modals').find('div').should('be.visible');
      
      // Проверяем, что в модальном окне отображается правильный ингредиент
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('должен закрыть модальное окно при клике на крестик', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('a')
        .first()
        .click();

      // Ждем появления модального окна
      cy.url().should('include', '/ingredients/');
      cy.get('#modals').should('exist');

      // Ищем и кликаем на кнопку закрытия (крестик) - кнопка внутри модального окна
      // Используем first() чтобы выбрать первую кнопку, которая является кнопкой закрытия
      cy.get('#modals').find('button').first().should('be.visible').click();

      // Проверяем, что вернулись на главную страницу
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('должен закрыть модальное окно при клике на оверлей', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('a')
        .first()
        .click();

      // Ждем появления модального окна
      cy.url().should('include', '/ingredients/');
      cy.get('#modals').should('exist');

      // Кликаем на оверлей - это последний div внутри #modals (overlay имеет z-index: 2)
      // Overlay рендерится последним, поэтому используем last()
      cy.get('#modals').find('div').last().click({ force: true });

      // Проверяем, что вернулись на главную страницу
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Создание заказа', () => {
    it('должен создать заказ и показать модальное окно с номером заказа', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Переключаемся на вкладку "Начинки"
      cy.contains('Начинки').click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Ждем запроса на создание заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно с заказом открылось
      cy.get('#modals').should('exist');
      cy.get('#modals').find('div').should('be.visible');

      // Проверяем, что номер заказа отображается (из моковых данных: 12345)
      cy.contains('12345').should('be.visible');
    });

    it('должен закрыть модальное окно заказа и очистить конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Переключаемся на вкладку "Начинки"
      cy.contains('Начинки').click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Ждем запроса на создание заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось
      cy.get('#modals').should('exist');
      cy.get('#modals').find('div').should('be.visible');

      // Закрываем модальное окно - ищем кнопку внутри #modals
      cy.get('#modals').find('button').should('be.visible').click();

      // Проверяем, что модальное окно закрылось (элемент должен быть пустым или скрыт)
      cy.get('#modals').should('exist');
      cy.contains('12345').should('not.exist');

      // Проверяем, что конструктор пуст (должны быть плейсхолдеры)
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
