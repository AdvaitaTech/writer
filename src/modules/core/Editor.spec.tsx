import React from "react";
import { AdvaitaWriterRef, Writer } from "./Editor";
import {
  createNodeSelection,
  createTextSelection,
} from "src/modules/test/test-helpers";

const showEditor = (content: string = "") => {
  cy.mount(<Writer content={content || ""} setEditorRef={() => {}} />);
};

describe("Editor Component", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Writer content="Hello World" setEditorRef={() => {}} />);
    cy.contains("Hello World");
  });

  it("focuses editor", () => {
    cy.mount(<Writer content="First test" setEditorRef={() => {}} autoFocus />);
    cy.get(".adv-content").should("have.focus");
    let test: AdvaitaWriterRef;
    cy.mount(
      <Writer
        content="Second Test"
        setEditorRef={(ref) => {
          test = ref;
        }}
        autoFocus
      />
    );
    // @ts-ignore
    test?.focus();
    cy.get(".adv-content").should("have.focus");
  });

  describe("Nodes", () => {
    it("should set paragraph content", () => {
      showEditor("Hello World");
      cy.get(".adv-content p").clear();
      cy.get(".adv-content").type("This is a paragraph");
      cy.get(".adv-content").should("have.text", "This is a paragraph");
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
      cy.wait(100);
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
      cy.wait(100);
      cy.get(".adv-content").then((field) => {
        createTextSelection(field.get(0), 6, 9, 0, 0);
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
      cy.wait(100);
      cy.get(".adv-content").then((field) => {
        createTextSelection(field.get(0), 6, 9)
      });
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
      cy.wait(100);
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
      cy.wait(100);
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
      cy.wait(100);
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
      cy.wait(100);
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

    it("should remove a link", () => {
      showEditor("Hello World");
      cy.wait(100);
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
      cy.get(".adv-content p").then((field) =>
        createNodeSelection(field.get(0))
      );
      cy.get('[data-test-id="mark-link"]').click();
      cy.get('[data-test-id="cancel-link"]').click();
      cy.get(".adv-content p")
        .get('a[href="http://google.com"]')
        .should("not.exist");
    });

    it("should change highlight bubble icons if selection changes", () => {
      showEditor("Hello World");
      cy.wait(100);
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
      cy.wait(100);
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

    it("should insert a divider", () => {
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/divi{enter}");
      cy.get(".adv-content hr");
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

  describe("Change Nodes", () => {
    it("should change heading to paragraph", () => {
      showEditor("<h3>Hello World");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').click();
      cy.get(".block-menu").should("be.visible");
      cy.get('.block-menu [data-test-id="set-paragraph"]').click();
      cy.get(".block-menu").should("not.exist");
      cy.get(".adv-content p").contains("Hello World");
    });

    it("should change bullets to paragraph and back", () => {
      let menuPosition:any = null;
      showEditor("<ul><li>Hello World");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').then((el) => {
        menuPosition = el.position();
      });
      cy.get('[data-test-id="change-block"]').click();
      cy.get(".block-menu").should("be.visible");
      cy.get('.block-menu [data-test-id="set-paragraph"]').click();
      cy.get(".block-menu").should("not.exist");
      cy.get('[data-test-id="change-block"]').then((el) => {
        expect(el.position()).to.deep.eq(menuPosition || {});
      });
      cy.get('[data-test-id="change-block"]').click();
      cy.get(".block-menu").should("be.visible");
      cy.get('.block-menu [data-test-id="set-bullet-list"]').click();
      cy.get(".adv-content li").contains("Hello World");
    });

    it("should change list to paragraph and back", () => {
      let menuPosition:any = null;
      showEditor("<ol><li>Hello World");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').then((el) => {
        menuPosition = el.position();
      });
      cy.get('[data-test-id="change-block"]').click();
      cy.get(".block-menu").should("be.visible");
      cy.get('.block-menu [data-test-id="set-paragraph"]').click();
      cy.get(".block-menu").should("not.exist");
      cy.get('[data-test-id="change-block"]').then((el) => {
        expect(el.position()).to.deep.eq(menuPosition);
      });
      cy.get('[data-test-id="change-block"]').click();
      cy.get(".block-menu").should("be.visible");
      cy.get('.block-menu [data-test-id="set-ordered-list"]').click();
      cy.get(".adv-content li").contains("Hello World");
    });

    it("should change heading to smaller heading", () => {
      showEditor("<h1>Hello World");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').click();
      cy.get(".block-menu").should("be.visible");
      cy.get('.block-menu [data-test-id="set-heading2"]').click();
      cy.get(".block-menu").should("not.exist");
      cy.get(".adv-content h2").contains("Hello World");
    });

    it("should change para to blockquote", () => {
      showEditor("Hello World");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').click();
      cy.get(".block-menu").should("be.visible");
      cy.get('.block-menu [data-test-id="set-quote"]').click();
      cy.get(".block-menu").should("not.exist");
      cy.get(".adv-content blockquote").contains("Hello World");
    });

    it("should show the bubble menu for the current block being edited", () => {
      let firstLocation = null;
      showEditor("Hello World");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').then((el) => {
        firstLocation = el.position();
      });
      cy.get(".adv-content").type("{enter}Second node");
      cy.get('[data-test-id="change-block"]').then((el) => {
        firstLocation = el.position();
        expect(el.position()).to.not.eq(firstLocation);
      });
    });

    it("should change quote to heading removing blockquote", () => {
      showEditor("<blockquote>Hello World</blockquote>");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').click();
      cy.get('.block-menu [data-test-id="set-heading1"]').click();
      cy.get(".adv-content h1").contains("Hello World");
    });

    it("should change quote to numbered list removing blockquote", () => {
      showEditor("<blockquote>Hello World</blockquote>");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').click();
      cy.get('.block-menu [data-test-id="set-ordered-list"]').click();
      cy.get(".adv-content ol li").contains("Hello World");
    });

    it("should change quote to code block", () => {
      showEditor("<blockquote>Hello World</blockquote>");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').click();
      cy.get('.block-menu [data-test-id="set-code"]').click();
      cy.get(".adv-content pre code").contains("Hello World");
    });

    it("should change quote to callout", () => {
      showEditor("<blockquote>Hello World</blockquote>");
      cy.get(".adv-content").focus();
      cy.get('[data-test-id="change-block"]').click();
      cy.get('.block-menu [data-test-id="set-callout"]').click();
      cy.get(".adv-content .callout").contains("Hello World");
    });

    it("should not show the change node menu for images and videos", () => {
      const url =
        "https://images.vexels.com/media/users/3/136995/isolated/lists/799cbe2494ac10761303868f937c68d0-tiny-recycle-arrow.png";
      const video = "https://www.youtube.com/watch?v=tD8KUyQPmmE";
      showEditor("Hello World");
      cy.get(".adv-content").type("{enter}/");
      cy.get('.insert-menu [data-test-id="insert-image"]').click();
      cy.get(".adv-content image-placeholder input").type(`${url}{enter}`);
      cy.get('[data-test-id="change-block"]').should("not.exist");
      cy.get(`.adv-content .image-container img[src="${url}"]`);
      cy.get(".adv-content").type("{enter}/");
      cy.get('.insert-menu [data-test-id="insert-video"]').click();
      cy.get(".adv-content video-placeholder input").type(`${video}{enter}`);
      cy.get(`.adv-content div[data-youtube-video] iframe`);
    });
  });

  describe("Search", () => {
    it("should search and go through each search result", () => {
      let bubblePosition: unknown;
      showEditor("This is very distressing is what it is");
      cy.get("[data-test-id='search-input']").type("i").type("s").type("{enter}");
      cy.wait(100);
      cy.get(".adv-content span.search-result").contains("is");
      cy.get(".bubble-menu").then(
        (el) => (bubblePosition = el[0].getBoundingClientRect())
      );
      cy.get(".adv-content").type("{ctrl},{ctrl},");
      cy.wait(400);
      cy.get(".bubble-menu").then((el) =>
        expect(el[0].getBoundingClientRect()).to.not.deep.eq(bubblePosition)
      );
      cy.get(".adv-content").type("{ctrl},{ctrl},{ctrl},");
      cy.wait(400);
      // it should cycle back to first after all results are looped
      cy.get(".bubble-menu").then((el) =>
        expect(el[0].getBoundingClientRect()).to.deep.eq(bubblePosition)
      );
      cy.get(".adv-content").type("{ctrl}.");
      cy.wait(400);
      cy.get(".bubble-menu").then((el) =>
        expect(el[0].getBoundingClientRect()).to.not.deep.eq(bubblePosition)
      );
    });

    it("should search and replace one by one", () => {
      let bubblePosition: unknown;
      showEditor("This is very sad is what it is");
      cy.get("[data-test-id='search-input']").clear().type("i").type("s").type("{enter}");
      cy.get(".adv-content span.search-result").contains("is");
      cy.get("[data-test-id='replace-input']").type("snt{enter}");
      cy.get(".adv-content").contains("Thsnt is very sad is what it is");
      cy.get(".adv-content").type("{ctrl};");
      cy.get(".adv-content").contains("Thsnt snt very sad is what it is");
      cy.get(".adv-content").type("{ctrl};");
      cy.get(".adv-content").contains("Thsnt snt very sad snt what it is");
      cy.get(".adv-content").type("{ctrl};");
      cy.get(".adv-content").contains("Thsnt snt very sad snt what it snt");
    });
  });
});
