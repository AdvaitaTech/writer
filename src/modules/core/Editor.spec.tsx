import React from "react";
import Editor from "./Editor";
import {
  createNodeSelection,
  createTextSelection,
} from "src/modules/test/test-helpers";

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

    it("should render image nodes", () => {
      const url = "https://www.w3schools.com/html/pic_trulli.jpg";
      showEditor(`<img src='${url}'>`);
      cy.get(".editor span.image-container");
      cy.get(`.editor span img[src='${url}']`);
    });

    it("should render image nodes within paragraph tags", () => {
      const url = "https://www.w3schools.com/html/pic_trulli.jpg";
      showEditor(`<p><img src='${url}'></p>`);
      cy.get(".editor span.image-container");
      cy.get(`.editor span img[src='${url}']`);
    });

    it("should render block quotes", () => {
      showEditor("<blockquote>Quote Tweet</blockquote>");
      cy.get(".editor blockquote").contains("Quote Tweet");
    });

    it("should render youtube video", () => {
      const code =
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/KzV0mTqBcZA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
      showEditor(code);
      cy.get(".editor div[data-youtube-video]");
      cy.get(".editor div[data-youtube-video] iframe");
    });

    it("should render a divider", () => {
      showEditor("<p>Hi</p><hr><p>Bye</p>");
      cy.get(".editor hr");
    });

    it("should render a code block", () => {
      showEditor("<pre><code>const a = 1;</code></pre>");
      cy.get(".editor code").contains("const a = 1;");
    });

    it("should render a bullet list", function () {
      showEditor("<ul><li>List Item</li></ul>");
      cy.get(".editor ul li").contains("List Item");
    });

    it("should render a numbered list", () => {
      showEditor("<ol><li>List Item</li></ol>");
      cy.get(".editor ol li").contains("List Item");
    });

    it("should render a callout block", () => {
      showEditor('<div class="callout">Hello</div>');
      cy.get(".editor .callout").contains("Hello");
    });
  });

  describe("Marks", () => {
    it("should show the floating menu for marks", () => {
      showEditor("Hello World");
      cy.get(".bubble-menu").should("not.exist");
      cy.get(".adv-content").then((field) => {
        createTextSelection(field.get(0), 6, 9);
      });
      cy.get(".bubble-menu");
    });

    it("should only show the bubble menu on paragraph nodes", () => {
      showEditor(
        "<p>Hello World</p><ul><li>List Item</li></ul><h2>Heading</h2><pre><code>Code block</code></pre>"
      );
      cy.get(".adv-content").then((field) => {
        createTextSelection(field.get(0), 6, 9, 0, 0);
        return field;
      });
      cy.get(".bubble-menu");
      cy.get(".adv-content ul li").then((field) => {
        createNodeSelection(field.get(0));
      });
      cy.get(".bubble-menu").should("exist");
      cy.get(".adv-content").then((field) => {
        createTextSelection(field.get(0), 2, 4, 2, 2);
      });
      cy.get(".bubble-menu").should("not.exist");
      cy.get(".adv-content pre").then((field) => {
        createTextSelection(field.get(0), 2, 4, 0, 0);
      });
      cy.get(".bubble-menu").should("not.exist");
    });

    it("should toggle bold mark", () => {
      showEditor("Hello World");
      cy.get(".adv-content").then((field) =>
        createTextSelection(field.get(0), 6, 9)
      );
      cy.get(".bubble-menu");
      cy.get('[data-test-id="mark-bold"]')
        .click()
        .should("have.class", "active");
      cy.get(".adv-content p").then((el) => {
        const text = el.html();
        expect(text).to.eq("Hello <strong>Wor</strong>ld");
      });
    });

    it("should toggle italic mark", () => {
      showEditor("Hello World");
      cy.get(".adv-content").then((field) =>
        createTextSelection(field.get(0), 6, 9)
      );
      cy.get(".bubble-menu");
      cy.get('[data-test-id="mark-italic"]')
        .click()
        .should("have.class", "active");
      cy.get(".adv-content p").then((el) =>
        expect(el.html()).to.eq("Hello <em>Wor</em>ld")
      );
    });

    it("should toggle underline mark", () => {
      showEditor("Hello World");
      cy.get(".adv-content").then((field) =>
        createTextSelection(field.get(0), 6, 9)
      );
      cy.get(".bubble-menu");
      cy.get('[data-test-id="mark-underline"]')
        .click()
        .should("have.class", "active");
      cy.get(".adv-content p").then((el) =>
        expect(el.html()).to.eq("Hello <u>Wor</u>ld")
      );
    });

    it("should toggle strike mark", () => {
      showEditor("Hello World");
      cy.get(".adv-content").then((field) =>
        createTextSelection(field.get(0), 6, 9)
      );
      cy.get(".bubble-menu");
      cy.get('[data-test-id="mark-strike"]')
        .click()
        .should("have.class", "active");
      cy.get(".adv-content p").then((el) =>
        expect(el.html()).to.eq("Hello <s>Wor</s>ld")
      );
    });

    it("should insert a link", () => {
      showEditor("Hello World");
      cy.get(".adv-content").then((field) =>
        createTextSelection(field.get(0), 6, 9)
      );
      cy.get(".bubble-menu");
      cy.get('[data-test-id="mark-link"]').click();
      cy.get(".bubble-menu .insert-link-box");
      cy.get('.bubble-menu [data-test-id="insert-link-value"]')
        .type("http://google.com")
        .type("{enter}");
      cy.get(".adv-content p").get('a[href="http://google.com"]');
      cy.get(".adv-content").then((field) =>
        createTextSelection(field.get(0), 2, 4)
      );
      cy.get('.bubble-menu [data-test-id="mark-link"]');
    });

    it("should change highlight bubble icons if selection changes", () => {
      showEditor("Hello World");
      cy.get(".adv-content").then((field) =>
        createTextSelection(field.get(0), 6, 9)
      );
      cy.get(".bubble-menu");
      cy.get('[data-test-id="mark-strike"]')
        .click()
        .should("have.class", "active");
      cy.get(".adv-content").then((field) =>
        createTextSelection(field.get(0), 0, 2)
      );
      cy.get('[data-test-id="mark-strike"]').should("not.have.class", "active");
    });
  });

  describe("Node Creation", () => {
    it("should show the insertion menu on / character", () => {
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/");
      cy.get(".insert-menu");
    });

    it("should insert 3 types of headings", () => {
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/");
      cy.get('.insert-menu [data-test-id="insert-heading1"]').click();
      cy.get(".adv-content").type("Head{enter}/");
      cy.get(".adv-content h1").contains("Head");
      cy.get('.insert-menu [data-test-id="insert-heading2"]').click();
      cy.get(".adv-content").type("Head{enter}/");
      cy.get(".adv-content h2").contains("Head");
      cy.get('.insert-menu [data-test-id="insert-heading3"]').click();
      cy.get(".adv-content").type("Head");
      cy.get(".adv-content h3").contains("Head");
    });

    it("should insert a blockquote", () => {
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/");
      cy.get('.insert-menu [data-test-id="insert-quote"]').click();
      cy.get(".adv-content").type("Hi");
      cy.get(".adv-content blockquote").contains("Hi");
    });

    it("should insert an image embed via placeholder", () => {
      const url =
        "https://images.vexels.com/media/users/3/136995/isolated/lists/799cbe2494ac10761303868f937c68d0-tiny-recycle-arrow.png";
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/");
      cy.get('.insert-menu [data-test-id="insert-image"]').click();
      cy.get(".adv-content image-placeholder input").type(`${url}{enter}`);
      cy.get(".adv-content .image-node .caption span").then((el) => {
        // Without base css el is not visible, so doing a testing hack
        el.get(0).appendChild(document.createTextNode("Caption for text"));
      });
      cy.get(`.adv-content .image-container img[src="${url}"]`);
      cy.get(`.adv-content .image-container span`).contains("Caption for text");
    });

    it.skip("should paste an image from clipboard as an image node", () => {
      const svgText =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII";
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}");
      cy.get(".adv-content").then((el) =>
        cy.pasteImage(el.get(0), new File([svgText], "ico.png"))
      );
      cy.get(".adv-content .image-node .caption span").then((el) => {
        // Without base css el is not visible, so doing a testing hack
        el.get(0).appendChild(document.createTextNode("Caption for text"));
      });
      cy.get(`.adv-content .image-container img`);
      cy.get(`.adv-content .image-container span`).contains("Caption for text");
    });

    it("should insert a youtube embed via placeholder", () => {
      const url = "https://www.youtube.com/watch?v=tD8KUyQPmmE";
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/");
      cy.get('.insert-menu [data-test-id="insert-video"]').click();
      cy.get(".adv-content video-placeholder input").type(`${url}{enter}`);
      cy.get(`.adv-content div[data-youtube-video] iframe`);
    });

    it("should insert a bulletted list", () => {
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/bullet{enter}").type("List Item 1");
      cy.get(".adv-content ul li").contains("List Item 1");
    });

    it("should insert a numbered list", () => {
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/number{enter}").type("List Item 1");
      cy.get(".adv-content ol li").contains("List Item 1");
    });

    it("should insert a callout", () => {
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/call{enter}").type("List Item 1");
      cy.get(".adv-content .callout span").contains("List Item 1");
    });

    it("should cycle through node types via arrow keys", () => {
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/").type("{downArrow}");
      cy.get('.insert-menu [data-test-id="insert-heading1"]').should(
        "have.class",
        "active"
      );
      cy.get(".adv-content").type("{downArrow}");
      cy.get('.insert-menu [data-test-id="insert-heading2"]').should(
        "have.class",
        "active"
      );
      cy.get(".adv-content").type("{upArrow}{upArrow}");
      cy.get('.insert-menu [data-test-id="insert-video"]').should(
        "have.class",
        "active"
      );
    });
  });
});
