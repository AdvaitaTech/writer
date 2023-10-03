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
import { SearchBoxComponent, SearchPlugin } from "./nodes/SearchPlugin";

export class AdvaitaWriterRef {
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
  onUpdate?: () => void;
  setEditorRef: (ref: AdvaitaWriterRef) => void;
}

export const Writer = ({
  content,
  placeholder,
  styles,
  onUpdate,
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
      SearchPlugin,
    ],
    content,
    editorProps: {
      attributes: {
        class: "adv-content",
      },
    },
    onCreate: ({ editor }) => {
      console.log("create", editor);
      setEditorRef(new AdvaitaWriterRef(editor as EditorReact));
    },
    onUpdate: ({}) => {
      if (onUpdate) {
        onUpdate();
      }
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
      {editor && (
        <SearchBoxComponent
          className="change-menu"
          editor={editor}
          containerRef={containerRef}
        ></SearchBoxComponent>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};
