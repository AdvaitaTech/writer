import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, Editor as EditorReact } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CalloutNode } from "./nodes/CalloutNode";
import ImageNode from "./nodes/ImageNode";
import YoutubeNode from "./nodes/YoutubeNode";
import { RefObject, useRef } from "react";
import CommandsPlugin from "./nodes/CommandsPlugin";
import ImagePlaceholderNode from "./nodes/ImagePlaceholderNode";
import VideoPlaceholderNode from "./nodes/VideoPlaceholderNode";
import { BubbleMenu } from "./menus/BubbleMenu";
import { ChangeMenu } from "./menus/ChangeMenu";
import { ChangeIcon } from "./assets/icons/ChangeIcon";

export class AdvaitaEditorRef {
  private editor: EditorReact | null = null;
  constructor(editor: EditorReact) {
    this.editor = editor;
  }

  exportHTML() {
    return this.editor!.getHTML();
  }
}

interface EditorProps {
  content?: string;
  placeholder?: string;
  styles?: string;
  setEditorRef: (ref: AdvaitaEditorRef) => void;
}

const Editor = ({
  content,
  placeholder,
  styles,
  setEditorRef,
}: EditorProps) => {
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
    onCreate: ({ editor }) => {
      console.log("create", editor);
      setEditorRef(new AdvaitaEditorRef(editor as EditorReact));
    },
  });

  return (
    <div ref={containerRef} className={styles || "editor"}>
      {editor && <BubbleMenu editor={editor} containerRef={containerRef} />}
      {editor && (
        <ChangeMenu
          className="change-menu"
          editor={editor}
          containerRef={containerRef}
        ></ChangeMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
