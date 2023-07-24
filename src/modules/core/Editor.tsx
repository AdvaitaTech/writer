import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CalloutNode } from "./nodes/CalloutNode";
import ImageNode from "./nodes/ImageNode";
import YoutubeNode from "./nodes/YoutubeNode";
import clsx from "clsx";
import { BoldIcon } from "./assets/icons/BoldIcon";
import { ItalicIcon } from "./assets/icons/ItalicIcon";
import { UnderlineIcon } from "./assets/icons/UnderlineIcon";
import { StrikeIcon } from "./assets/icons/StrikeIcon";
import { LinkIcon } from "./assets/icons/LinkIcon";
import SelectionMenu, { SelectionMenuType } from "./menus/SelectionMenu";
import { useRef, useState } from "react";

interface EditorProps {
  content: string;
  placeholder?: string;
}

const Editor = ({ content, placeholder }: EditorProps) => {
  const [selectionType, setSelectionType] = useState<SelectionMenuType>(null);
  const containerRef = useRef<HTMLDivElement>(null)
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
      YoutubeNode,
    ],
    content,
    editorProps: {
      attributes: {
        class: "adv-content",
      },
    },
  });

  return (
    <div ref={containerRef}>
      {editor && containerRef.current && (
        <BubbleMenu
          pluginKey="bubbleMenu"
          editor={editor}
          className="bubble-menu"
          shouldShow={({ editor }) => {
            return editor.isActive("paragraph");
          }}
          tippyOptions={{
            appendTo: containerRef.current
          }}
        >
          <button
            type="button"
            data-test-id="mark-bold"
            className={clsx({
              active: editor.isActive("bold"),
            })}
            onClick={() => editor.chain().toggleBold().run()}
          >
            <BoldIcon />
          </button>
          <button
            type="button"
            data-test-id="mark-italic"
            className={clsx({
              active: editor.isActive("italic"),
            })}
            onClick={() => editor.chain().toggleItalic().run()}
          >
            <ItalicIcon />
          </button>
          <button
            type="button"
            data-test-id="mark-underline"
            className={clsx({
              active: editor.isActive("underline"),
            })}
            onClick={() => editor.chain().toggleUnderline().run()}
          >
            <UnderlineIcon />
          </button>
          <button
            type="button"
            data-test-id="mark-strike"
            className={clsx({
              active: editor.isActive("strike"),
            })}
            onClick={() => editor.chain().toggleStrike().run()}
          >
            <StrikeIcon />
            <i id="strike"></i>
          </button>
          <button
            type="button"
            data-test-id="mark-link"
            className={clsx({
              active: editor.isActive("link"),
            })}
            onClick={() => {
              setSelectionType("link");
            }}
          >
            <LinkIcon />
          </button>
        </BubbleMenu>
      )}
      {editor && <SelectionMenu
        editor={editor}
        type={selectionType}
        setSelectionType={setSelectionType}
      />}
      <EditorContent editor={editor} className="editor" />
    </div>
  );
};

export default Editor;
