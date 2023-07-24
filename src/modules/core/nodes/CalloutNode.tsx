import { Node, mergeAttributes } from "@tiptap/core";
import { RawCommands } from "@tiptap/react";

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
            console.log('isCallout', isCallout, node.classList)
          return isCallout ? {} : false;
        },
      },
    ];
  },
  addCommands: () => {
    return {
      setMailwall:
        () =>
        ({ commands }: { commands: RawCommands }) => {
          return commands.setNode("callout");
        },
    } as Partial<RawCommands>;
  },
});
