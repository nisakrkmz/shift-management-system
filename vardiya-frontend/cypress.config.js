const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001', // Next.js frontend
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: true, // Video kaydını etkinleştir
    videoCompression: 32, // Video sıkıştırma kalitesi (1-51 arası, düşük değer daha iyi kalite)
    videoUploadOnPasses: false, // Sadece başarısız testler için video kaydet
    setupNodeEvents(on, config) {
      // Node event listeners eklenebilir
    },
  },
});
