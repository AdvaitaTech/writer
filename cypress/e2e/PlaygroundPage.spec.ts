const localhost = "http://localhost:3000/playground";
describe("Playground Page", () => {
  it("renders", () => {
    cy.visit(localhost);
    cy.get(".adv-editor");
  });

  describe("Editor UI", () => {
    it("shows the editor as fullscreen", () => {
      cy.visit(localhost);
    });

    it("should show preview and edit states", () => {
      cy.visit(localhost);
      cy.get(".adv-editor .adv-content");
      cy.get(".previewBtn").click();
      cy.get('.previewBtn').contains('Edit');
      cy.get(".adv-editor .editor .adv-content");
    });
  });
});
