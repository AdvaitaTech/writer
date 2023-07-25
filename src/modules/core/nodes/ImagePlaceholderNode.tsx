import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  KeyboardEvent,
  useRef,
} from "react";
import { Node, NodeViewRendererProps, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { ImageIcon } from "../assets/icons/ImageIcon";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["image-placeholder"]: DetailedHTMLProps<
        HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
    }
  }
}

const ImagePlaceholderComponent = ({
  editor,
  node,
  ...rest
}: NodeViewRendererProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileInput = async (event: KeyboardEvent<HTMLInputElement>) => {
    const location = event.currentTarget.value || "";
    editor.chain().focus().setImage({ src: location }).run();
  };

  return (
    <NodeViewWrapper>
      <image-placeholder>
        <ImageIcon />
        <input
          ref={inputRef}
          type="text"
          autoFocus
          placeholder="Enter image url"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFileInput(e);
          }}
        />
      </image-placeholder>
    </NodeViewWrapper>
  );
};

const ImagePlaceholderNode = Node.create({
  name: "imagePlaceholder",
  group: "block",
  atom: true,
  parseHTML: () => {
    return [
      {
        tag: "image-placeholder",
      },
    ];
  },
  renderHTML: ({ HTMLAttributes }) => {
    return ["image-placeholder", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholderComponent);
  },
});

export default ImagePlaceholderNode;
