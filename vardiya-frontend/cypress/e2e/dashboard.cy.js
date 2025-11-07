describe('Dashboard', () => {
  it('should load the dashboard page', () => {
    // Sayfayı ziyaret et
    cy.visit('/dashboard');
    
    // Sayfanın yüklendiğini kontrol et
    cy.get('body').should('be.visible');
    
    // Sayfada herhangi bir metin içeriğinin göründüğünü kontrol et
    cy.contains(/yaklaşan|vardiya|çalışma|saat/i).should('be.visible');
  });
});
