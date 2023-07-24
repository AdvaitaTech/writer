import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CalloutNode } from "./nodes/CalloutNode";
import ImageNode from "./nodes/ImageNode";
import YoutubeNode from "./nodes/YoutubeNode";

interface EditorProps {
  content: string;
  placeholder?: string;
}

const Editor = ({ content, placeholder }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
      Underline,
      Link,
      Blockquote,
      CalloutNode,
      ImageNode,
      YoutubeNode
    ],
    content,
    editorProps: {
      attributes: {
        class: "adv-content",
      },
    },
  });

  return (
    <>
      <EditorContent editor={editor} className="editor" />
    </>
  );
};

export default Editor;
