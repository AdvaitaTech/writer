import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CalloutNode } from "./nodes/CalloutNode";
import ImageNode from "./nodes/ImageNode";
import YoutubeNode from "./nodes/YoutubeNode";
import { useRef } from "react";
import CommandsPlugin from "./nodes/CommandsPlugin";
import ImagePlaceholderNode from "./nodes/ImagePlaceholderNode";
import VideoPlaceholderNode from "./nodes/VideoPlaceholderNode";
import { BubbleMenu } from "./menus/BubbleMenu";
import { ChangeMenu } from "./menus/ChangeMenu";
import { ChangeIcon } from "./assets/icons/ChangeIcon";

interface EditorProps {
  content?: string;
  placeholder?: string;
  styles?: string;
  onUpdate: (html: string) => void;
}

const Editor = ({ content, placeholder, styles, onUpdate }: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
      Underline,
      Link,
      CalloutNode,
      ImageNode,
      YoutubeNode,
      CommandsPlugin,
      ImagePlaceholderNode,
      VideoPlaceholderNode,
    ],
    content,
    editorProps: {
      attributes: {
        class: "adv-content",
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  return (
    <div ref={containerRef} className={styles || "editor"}>
      {editor && <BubbleMenu editor={editor} containerRef={containerRef} />}
      {editor && (
        <ChangeMenu className="change-menu" editor={editor} containerRef={containerRef}>
        </ChangeMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
