import React from "react";
import Editor from "./Editor";

const showEditor = (content: string = "") => {
  cy.mount(<Editor content={content || ""} />);
};

describe("Editor Component", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Editor content="Hello World" />);
    cy.contains("Hello World");
  });

  describe("Nodes", () => {
    it("should set paragraph content", () => {
      showEditor("Hello World");
      cy.get(".editor p").clear();
      cy.get(".editor").type("This is a paragraph");
      cy.get(".editor").should("have.text", "This is a paragraph");
    });

    it("should show a placeholder", () => {
      showEditor();
      cy.get('.editor [data-placeholder="Start writing..."]');
    });

    it("should render 3 heading types", () => {
      showEditor("<h1>Heading</h1><h2>Subheading</h2><h3>Minor heading</h3>");
      cy.get(".editor h1").contains("Heading");
      cy.get(".editor h2").contains("Subheading");
      cy.get(".editor h3").contains("Minor heading");
    });
  });
});
