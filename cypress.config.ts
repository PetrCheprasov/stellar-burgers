import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    // Отключаем автоматическую проверку сервера при запуске
    // Сервер должен быть запущен вручную перед запуском тестов
    defaultCommandTimeout: 10000,
    requestTimeout: 10000
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  }
});
