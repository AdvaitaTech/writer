import { Editor, posToDOMRect, Extension } from "@tiptap/core";
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import {
  RefObject,
  useEffect,
  useState,
  PropsWithChildren,
  HTMLAttributes,
} from "react";
import tippy, { Instance, Props } from "tippy.js";
import { ChangeIcon } from "../assets/icons/ChangeIcon";

export interface ChangeMenuPluginProps {
  pluginKey: PluginKey | string;
  editor: Editor;
  element: HTMLElement;
  tippyOptions?: Partial<Props>;
  shouldShow?:
    | ((props: {
        editor: Editor;
        view: EditorView;
        state: EditorState;
        oldState?: EditorState;
      }) => boolean)
    | null;
}

export type ChangeMenuViewProps = ChangeMenuPluginProps & {
  view: EditorView;
};

export class ChangeMenuView {
  public editor: Editor;

  public element: HTMLElement;

  public view: EditorView;

  public preventHide = false;

  public tippy: Instance | undefined;

  public tippyOptions?: Partial<Props>;

  public shouldShow: Exclude<ChangeMenuPluginProps["shouldShow"], null> = ({
    view,
    state,
  }) => {
    const { selection } = state;
    const { $anchor, empty } = selection;
    const disabledContents = [
      "imageNode",
      "imagePlaceholder",
      "videoNode",
      "videoPlaceholder",
    ];
    let isDisabled = false;
    if ($anchor && $anchor.node(1)) {
      const node = $anchor.node(1);
      const contents = node.content ? node.content?.toJSON() || [] : [];
      isDisabled = contents.find((c: { type: string }) =>
        disabledContents.includes(c.type)
      );
    }
    const isRootDepth = $anchor.depth === 1;
    const isEmptyTextBlock =
      $anchor.parent.isTextblock &&
      !$anchor.parent.type.spec.code &&
      !$anchor.parent.textContent;

    if (
      !view.hasFocus() ||
      isDisabled ||
      // !empty ||
      // !isRootDepth ||
      // !isEmptyTextBlock ||
      !this.editor.isEditable
    ) {
      return false;
    }

    return true;
  };

  constructor({
    editor,
    element,
    view,
    tippyOptions = {},
    shouldShow,
  }: ChangeMenuViewProps) {
    this.editor = editor;
    this.element = element;
    this.view = view;

    if (shouldShow) {
      this.shouldShow = shouldShow;
    }

    this.element.addEventListener("mousedown", this.mousedownHandler, {
      capture: true,
    });
    this.editor.on("focus", this.focusHandler);
    this.editor.on("blur", this.blurHandler);
    this.tippyOptions = tippyOptions;
    // Detaches menu content from its current parent
    this.element.remove();
    this.element.style.visibility = "visible";
  }

  mousedownHandler = () => {
    this.preventHide = true;
  };

  focusHandler = () => {
    // we use `setTimeout` to make sure `selection` is already updated
    setTimeout(() => this.update(this.editor.view));
  };

  blurHandler = ({ event }: { event: FocusEvent }) => {
    if (this.preventHide) {
      this.preventHide = false;

      return;
    }

    if (
      event?.relatedTarget &&
      this.element.parentNode?.contains(event.relatedTarget as Node)
    ) {
      return;
    }

    // this.hide();
  };

  tippyBlurHandler = (event: FocusEvent) => {
    this.blurHandler({ event });
  };

  createTooltip() {
    const { element: editorElement } = this.editor.options;
    const editorIsAttached = !!editorElement.parentElement;

    if (this.tippy || !editorIsAttached) {
      return;
    }

    this.tippy = tippy(editorElement, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: true,
      trigger: "manual",
      placement: "right-start",
      // hideOnClick: "toggle",
      ...this.tippyOptions,
    });

    // maybe we have to hide tippy on its own blur event as well
    if (this.tippy.popper.firstChild) {
      (this.tippy.popper.firstChild as HTMLElement).addEventListener(
        "blur",
        this.tippyBlurHandler
      );
    }
  }

  update(view: EditorView, oldState?: EditorState) {
    const { state } = view;
    const { doc, selection } = state;
    const isSame =
      oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);

    if (isSame) {
      return;
    }

    this.createTooltip();

    const shouldShow = this.shouldShow?.({
      editor: this.editor,
      view,
      state,
      oldState,
    });

    if (!shouldShow) {
      // this.hide();

      return;
    }

    this.tippy?.setProps({
      getReferenceClientRect:
        this.tippyOptions?.getReferenceClientRect ||
        (() => {
          const from = selection.$from.posAtIndex(0);
          const boundaries = posToDOMRect(view, 1, 1);
          const nodeRect = posToDOMRect(view, from, from);
          return {
            ...nodeRect,
            left: boundaries.left,
            right: boundaries.right,
          };
        }),
    });

    this.show();
  }

  show() {
    this.tippy?.show();
  }

  hide() {
    this.tippy?.hide();
  }

  destroy() {
    return;
    // if (this.tippy?.popper.firstChild) {
    //   (this.tippy.popper.firstChild as HTMLElement).removeEventListener(
    //     "blur",
    //     this.tippyBlurHandler
    //   );
    // }
    // this.tippy?.destroy();
    // this.element.removeEventListener("mousedown", this.mousedownHandler, {
    //   capture: true,
    // });
    // this.editor.off("focus", this.focusHandler);
    // this.editor.off("blur", this.blurHandler);
  }
}

const ChangeMenuPlugin = (options: ChangeMenuPluginProps) => {
  return new Plugin({
    key:
      typeof options.pluginKey === "string"
        ? new PluginKey(options.pluginKey)
        : options.pluginKey,
    view: (view) => new ChangeMenuView({ view, ...options }),
  });
};

export const ChangeMenuReact = Extension.create({
  name: "changeMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "changeMenu",
      shouldShow: null,
    };
  },
  addProseMirrorPlugins() {
    return [
      ChangeMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        shouldShow: this.options.shouldShow,
      }),
    ];
  },
});

export interface ChangeMenuProps {
  containerRef: RefObject<HTMLDivElement>;
  className?: string;
  editor: Editor;
  tippyOptions?: Partial<Props>;
  shouldShow?:
    | ((props: {
        editor: Editor;
        view: EditorView;
        state: EditorState;
        oldState?: EditorState;
      }) => boolean)
    | null;
}

export type MenuItemProps = {
  title: string;
  subtitle?: string;
  attrs: any;
  command: ({
    editor,
    range,
  }: {
    editor: Editor;
    range: { from: number; to: number };
  }) => void;
}[];

export const ChangeMenu = (props: PropsWithChildren<ChangeMenuProps>) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }

    if (props.editor.isDestroyed) {
      return;
    }

    const pluginKey = "changeMenu";
    const { editor, tippyOptions = {}, shouldShow = null } = props;

    const plugin = ChangeMenuPlugin({
      editor,
      element,
      pluginKey,
      shouldShow,
      tippyOptions,
    });

    editor.registerPlugin(plugin);
    return () => editor.unregisterPlugin(pluginKey);
  }, [props.editor, element]);

  const menus: MenuItemProps = [
    {
      title: "Paragraph",
      attrs: {
        "data-test-id": "set-paragraph",
      },
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .clearNodes()
          .toggleNode("paragraph", "paragraph", {})
          .run();
      },
    },
    {
      title: "Heading",
      attrs: {
        "data-test-id": "set-heading1",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().setNode("heading", { level: 1 }).run();
      },
    },
    {
      title: "Subheading",
      attrs: {
        "data-test-id": "set-heading2",
      },
      command: ({ editor }) => {
        editor.chain().focus().setNode("heading", { level: 2 }).run();
      },
    },
    {
      title: "Small Subheading",
      attrs: {
        "data-test-id": "set-heading3",
      },
      command: ({ editor }) => {
        editor.chain().focus().setNode("heading", { level: 3 }).run();
      },
    },
    {
      title: "Quote",
      attrs: {
        "data-test-id": "set-quote",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().clearNodes().setBlockquote().run();
      },
    },
    {
      title: "Bullet List",
      attrs: {
        "data-test-id": "set-bullet-list",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().clearNodes().toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      attrs: {
        "data-test-id": "set-ordered-list",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().toggleOrderedList().run();
      },
    },
    {
      title: "Code Block",
      attrs: {
        "data-test-id": "set-code",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().setCodeBlock().run();
      },
    },
    {
      title: "Callout",
      attrs: {
        "data-test-id": "set-callout",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().setCallout().run();
      },
    },
  ];

  return (
    <div
      ref={setElement}
      className={props.className}
      data-test-id="change-block"
      style={{ visibility: "hidden" }}
    >
      <ChangeIcon onClick={() => setShowList(!showList)} />
      {showList ? (
        <div className="block-menu">
          {menus.map(({ attrs, title, subtitle, command }) => {
            return (
              <div
                key={title}
                className="menu-item"
                {...attrs}
                onClick={() => {
                  setShowList(false);
                  const { selection } = props.editor.state;
                  const $anchor = selection.$anchor;
                  const range = {
                    from: $anchor.posAtIndex(0, 1),
                    to: $anchor.posAtIndex(1, 1),
                  };
                  console.log("range 1 is", range);
                  command({ editor: props.editor, range });
                }}
              >
                {title}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
