import React, { useEffect, useRef, useState } from "react";
import {
  Node,
  mergeAttributes,
  nodePasteRule,
  Command,
  InputRule,
  ChainedCommands,
} from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { NodeSpec } from "@tiptap/pm/model";

type ResizerCallback = (arg0: {
  delta: { x: number; y: number };
  movement: { x: number; y: number };
}) => void;

declare module "@tiptap/core" {
  interface Commands {
    imageNode: {
      setImage: (options: { src: string }) => ChainedCommands;
    };
  }
}

class ImageResizer {
  dragStarted = false;
  startPointer = {
    x: 0,
    y: 0,
  };
  lastPointer = {
    x: 0,
    y: 0,
  };
  callback: ResizerCallback | null = null;

  constructor(callback: ResizerCallback) {
    this.callback = callback;
  }

  onMouseDown(event: React.MouseEvent) {
    this.dragStarted = true;
    const pointer = this._getPointer(event as unknown as MouseEvent);
    this.startPointer = { ...pointer };
    this.lastPointer = { ...pointer };
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseMove(event: MouseEvent) {
    if (this.dragStarted) {
      console.log("move", event.clientX, event.clientY, this.lastPointer);
      const pointer = this._getPointer(event);
      const delta = {
        x: pointer.x - this.lastPointer.x,
        y: pointer.y - this.lastPointer.y,
      };
      if (this.callback)
        this.callback({
          delta,
          movement: {
            x: pointer.x - this.startPointer.x,
            y: pointer.y - this.startPointer.y,
          },
        });
      this.lastPointer = { ...pointer };
    }
  }

  onMouseUp(event: MouseEvent) {
    this.dragStarted = false;
    this.startPointer = { x: 0, y: 0 };
    this.lastPointer = { x: 0, y: 0 };
    this.cleanup();
  }

  _getPointer(event: MouseEvent) {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  cleanup() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  handlers() {
    return {
      onMouseDown: this.onMouseDown.bind(this),
    };
  }
}

// const pasteHandler = ({ editor, postId }) => {
//   return new Plugin({
//     key: new PluginKey("handleImagePaste"),
//     props: {
//       handlePaste: async (view, event, slice) => {
//         const items = Array.from(event.clipboardData?.files || []);
//         for (const item of items) {
//           if (item.type.indexOf("image") === 0) {
//             let filesize = (item.size / 1024 / 1024).toFixed(4); // get the filesize in MB
//             if (filesize < 10) {
//               const response = await uploadImage(item, postId);
//               editor.commands.setImage({ src: response?.data.location });
//             } else {
//               throw new Error(
//                 "Images need to be in jpg or png format and less than 10mb in size."
//               );
//             }
//             return true;
//           }
//         }
//       },
//     },
//   });
// };

const ImageComponent = ({ node }: { node: NodeSpec }) => {
  const imageRef = useRef<HTMLElement>(null);
  const [resizer, setResizer] = useState<ImageResizer>();

  useEffect(() => {
    setResizer(
      new ImageResizer(({ delta }) => {
        if (!imageRef.current) return;
        const computed = window.getComputedStyle(imageRef.current);
        const width = parseInt(computed.getPropertyValue("width"));
        const newWidth = width + delta.x;
        if (newWidth < 50) return;
        imageRef.current.style.width = `${newWidth}px`;
      })
    );
  }, []);

  if (!resizer) return null;

  return (
    <NodeViewWrapper>
      <span className="image-node">
        <span ref={imageRef} className="image-container">
          <img src={(node.attrs?.src as string) || ""} />
          <NodeViewContent className="caption"></NodeViewContent>
          <span
            contentEditable="false"
            className="resizer"
            {...resizer.handlers()}
          ></span>
        </span>
      </span>
    </NodeViewWrapper>
  );
};

const ImageNode = Node.create({
  name: "imageNode",
  group: "inline",
  content: "inline*",
  inline: true,
  draggable: true,
  isolating: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      postId: {
        default: null,
      },
    };
  },
  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
  renderHTML: ({ HTMLAttributes, node }) => {
    console.log("render", HTMLAttributes);
    const mainImg = [
      "span",
      {
        "data-image-container": true,
        style: "display: flex;justify-content: center;",
      },
      ["img", mergeAttributes(HTMLAttributes, {})],
    ];
    const html =
      node.content.size !== 0
        ? [
            ...mainImg,
            [
              "span",
              {
                style:
                  "display: flex; justify-content: center; height: 20px; font-size: 12px; color: var(--bs-gray-800);",
              },
              0,
            ],
          ]
        : [...mainImg];
    return html as [string, any[]];
  },
  parseHTML: () => {
    return [
      {
        tag: "span",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const isImage = node.dataset.imageContainer === "true";
          return isImage
            ? {
                src: (node.firstChild as HTMLImageElement)?.src || "",
              }
            : false;
        },
      },
      {
        tag: "img",
      },
    ];
  },
  addInputRules() {
    const imgRegex =
      /(?:^|\s)((?:<img )(?:[^\>]*)(?:src=["'])([^"']*)(?:["'])(?:[^\>]*)(?:>)([^</img>]*)(?:<\/img>))/g;
    return [
      nodePasteRule({
        find: imgRegex,
        type: this.type,
        getAttributes: (matches) => {
          console.log("matches", matches);
          const src = matches[2] || "";
          return { src };
        },
      }),
    ] as InputRule[];
  },
  addPasteRules() {
    const imgRegex =
      /(?:^|\s)((?:<img )(?:[^\>]*)(?:src=["'])([^"']*)(?:["'])(?:[^\>]*)(?:>)([^</img>]*)(?:<\/img>))/g;
    return [
      nodePasteRule({
        find: imgRegex,
        type: this.type,
        getAttributes: (matches) => {
          console.log("matches", matches);
          const src = matches[2] || "";
          return { src };
        },
      }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
  addProseMirrorPlugins() {
    return [
      // pasteHandler({
      //   editor: this.editor,
      //   postId: this.options.postId,
      // }),
    ];
  },
});

export default ImageNode;
