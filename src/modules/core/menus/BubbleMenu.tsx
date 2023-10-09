import { BubbleMenu as BubbleMenuReact, Editor } from "@tiptap/react";
import clsx from "clsx";
import { RefObject, useEffect, useState } from "react";
import { BoldIcon } from "../assets/icons/BoldIcon";
import { ItalicIcon } from "../assets/icons/ItalicIcon";
import { UnderlineIcon } from "../assets/icons/UnderlineIcon";
import { StrikeIcon } from "../assets/icons/StrikeIcon";
import { LinkIcon } from "../assets/icons/LinkIcon";
import { TextSelection } from "@tiptap/pm/state";
import { CancelIcon } from "../assets/icons/CancelIcon";

export interface BubbleMenuProps {
  editor: Editor;
  containerRef: RefObject<HTMLDivElement>;
}

export type SelectionMenuType = "link" | null;

const SelectionMenu = ({
  editor,
  selectionType,
  setSelectionType,
}: {
  editor: Editor;
  selectionType: SelectionMenuType;
  setSelectionType: (type: SelectionMenuType) => void;
}) => {
  switch (selectionType) {
    case null:
      return (
        <>
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
        </>
      );
    case "link":
      return (
        <div className="insert-link-box">
          <input
            data-test-id="insert-link-value"
            autoFocus
            type="text"
            placeholder="Insert link address"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                editor
                  .chain()
                  .focus()
                  .setLink({
                    href: (event.target as HTMLInputElement).value,
                    target: "_blank",
                  })
                  .run();
                setSelectionType(null);
              }
            }}
          />
          <span
            data-test-id="cancel-link"
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <CancelIcon />
          </span>
        </div>
      );
  }
};

export const BubbleMenu = ({ editor, containerRef }: BubbleMenuProps) => {
  const [selectionType, setSelectionType] = useState<SelectionMenuType>(null);
  useEffect(() => {
    if (selectionType !== "link") setSelectionType(null);
  }, []);
  if (!editor || !containerRef.current) return null;
  return (
    <BubbleMenuReact
      pluginKey="bubbleMenu"
      editor={editor}
      className="bubble-menu"
      shouldShow={({ editor, view, state, oldState, from, to }) => {
        const { doc, selection } = state;
        const { empty } = selection;
        if (oldState?.selection !== state.selection) setSelectionType(null);
        function isTextSelection(value: unknown): value is TextSelection {
          return value instanceof TextSelection;
        }

        // Sometime check for `empty` is not enough.
        // Doubleclick an empty paragraph returns a node size of 2.
        // So we check also for an empty text size.
        const isEmptyTextBlock =
          !doc.textBetween(from, to).length && isTextSelection(state.selection);

        // When clicking on a element inside the bubble menu the editor "blur" event
        // is called and the bubble menu item is focussed. In this case we should
        // consider the menu as part of the editor and keep showing the menu
        const isChildOfMenu = view.dom.contains(document.activeElement);

        const hasEditorFocus = view.hasFocus() || isChildOfMenu;

        if (!hasEditorFocus || empty || isEmptyTextBlock) {
          return false;
        }

        return editor.isActive("paragraph");
      }}
      tippyOptions={{
        appendTo: containerRef.current,
      }}
    >
      <SelectionMenu
        editor={editor}
        selectionType={selectionType}
        setSelectionType={setSelectionType}
      />
    </BubbleMenuReact>
  );
};
