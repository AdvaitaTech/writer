import { Node, mergeAttributes } from "@tiptap/core";
import { CommandProps } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: () => ReturnType;
    };
  }
}

export const CalloutNode = Node.create({
  name: "callout",
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  content: "inline*",
  inline: false,
  group: "block",
  draggable: true,
  marks: "",
  renderHTML: ({ HTMLAttributes }) => {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "callout",
        disabled: true,
      }),
      ["span", {}, 0],
    ];
  },
  parseHTML: () => {
    return [
      {
        tag: "div",
        getAttrs: (node: string | HTMLElement) => {
          const isCallout =
            typeof node !== "string" && node.classList.contains("callout");
          return isCallout ? {} : false;
        },
      },
    ];
  },
  addCommands: () => {
    return {
      setCallout:
        () =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({ type: "callout" });
        },
    };
  },
});
