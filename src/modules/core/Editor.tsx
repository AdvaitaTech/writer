import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
