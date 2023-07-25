import React, { DetailedHTMLProps, HTMLAttributes, useRef } from "react";
import { Node, NodeViewRendererProps, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { CameraIcon } from "../assets/icons/CameraIcon";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["video-placeholder"]: DetailedHTMLProps<
        HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
    }
  }
}

const VideoPlaceholderComponent = ({
  editor,
  node,
  ...rest
}: NodeViewRendererProps) => {
  const videoRef = useRef<HTMLDivElement>(null);

  return (
    <NodeViewWrapper>
      <video-placeholder ref={videoRef}>
        <div className="heading-row">
          <CameraIcon />
        <input
          data-test-id="youtube-url"
          autoFocus
          placeholder="Enter a youtube url"
          onKeyDown={(e) => {
            const url = e.currentTarget.value;
            if (e.key === "Enter") {
              e.preventDefault();
              if (!url) return;
              editor
                .chain()
                .focus()
                .setYoutubeVideo({
                  src: url,
                })
                .run();
            }
          }}
        />
        </div>
      </video-placeholder>
    </NodeViewWrapper>
  );
};

const VideoPlaceholderNode = Node.create({
  name: "videoPlaceholder",
  group: "block",
  atom: true,
  parseHTML: () => {
    return [
      {
        tag: "video-placeholder",
      },
    ];
  },
  renderHTML: ({ HTMLAttributes }) => {
    return ["video-placeholder", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoPlaceholderComponent);
  },
});

export default VideoPlaceholderNode;
