// cypress/support/e2e.js
import './commands';

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err) => {
  console.error('Cypress detected uncaught exception:', err);
  // Return false to prevent the test from failing
  return false;
});

// Add retry-ability for flaky tests
Cypress.Commands.overwrite('should', (originalFn, subject, expectation, ...args) => {
  const originalRetries = {
    timeout: 4000,
    interval: 100
  };
  return originalFn.call(Cypress, subject, expectation, { ...originalRetries, ...args });
});