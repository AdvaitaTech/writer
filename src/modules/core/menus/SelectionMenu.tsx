import { posToDOMRect, Editor } from "@tiptap/core";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import tippy, { Props } from "tippy.js";

export type SelectionMenuType = "link" | null;

const SelectionPopover = ({
  editor,
  children,
  tippyProps,
}: PropsWithChildren<{ editor: Editor; tippyProps: Partial<Props> }>) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!element) return;

    element.remove();
    element.style.visibility = "visible";
    const selection = editor.state.selection;
    const domRect = posToDOMRect(editor.view, selection.from, selection.to);
    const popover = tippy(editor.options.element, {
      getReferenceClientRect: () => domRect,
      content: element,
      showOnCreate: true,
      interactive: true,
      trigger: "manual",
      placement: "bottom-start",
      ...tippyProps,
    });

    return () => popover.destroy();
  }, [element]);

  return (
    <div ref={setElement} style={{ visibility: "hidden" }}>
      {children}
    </div>
  );
};

// type can be 'link' or 'image'
const SelectionMenu = ({
  editor,
  type,
  setSelectionType,
}: {
  editor: Editor;
  type: SelectionMenuType;
  setSelectionType: (type: SelectionMenuType) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  if (!editor) return null;

  if (type === "link") {
    return (
      <div>
        <SelectionPopover
          editor={editor}
          tippyProps={{
            placement: "bottom",
            onMount: () => {
              inputRef.current?.focus();
            },
          }}
        >
          <div className="insert-link-box">
            <input
              ref={inputRef}
              data-test-id="insert-link-value"
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
          </div>
        </SelectionPopover>
      </div>
    );
  } else return null;
};

export default SelectionMenu;
