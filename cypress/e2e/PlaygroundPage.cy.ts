const localhost = 'http://localhost:5173'
describe('Playground Page', () => {
  it('renders', () => {
    cy.visit(localhost)
    cy.get('.play-editor')
  });

  describe('Editor UI', () => {
    it('shows the editor as fullscreen', () => {
      cy.visit(localhost);
    });
  });
})
