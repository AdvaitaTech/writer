import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface EditorProps {
  content: string;
}

const Editor = ({}: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Share your story...",
      }),
    ],
    content: "Hello World",
  });

  return (
    <>
      <EditorContent editor={editor} className="editor" />
    </>
  );
};

export default Editor;
