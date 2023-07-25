import tippy, { GetReferenceClientRect, Instance } from "tippy.js";
import Suggestion, { SuggestionProps } from "@tiptap/suggestion";
import React, { Component } from "react";
import { Extension, ReactRenderer } from "@tiptap/react";
import { Editor, Range } from "@tiptap/core";

class CommandsView extends Component<SuggestionProps> {
  state = {
    selectedIndex: null,
  };

  componentDidUpdate(oldProps: SuggestionProps) {
    if (this.props.items !== oldProps.items) {
      this.setState({
        selectedIndex: 0,
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowUp") {
      this.upHandler();
      return true;
    }

    if (event.key === "ArrowDown") {
      this.downHandler();
      return true;
    }

    if (event.key === "Enter") {
      this.enterHandler();
      return true;
    }

    return false;
  }

  upHandler() {
    this.setState({
      selectedIndex:
        ((this.state.selectedIndex || 0) + this.props.items.length - 1) %
        this.props.items.length,
    });
  }

  downHandler() {
    this.setState({
      selectedIndex:
        this.state.selectedIndex === null
          ? 0
          : ((this.state.selectedIndex || 0) + 1) % this.props.items.length,
    });
  }

  enterHandler() {
    this.selectItem(this.state.selectedIndex);
  }

  selectItem(index: number | null) {
    const item = this.props.items[index || 0];

    if (item) {
      this.props.command(item);
    }
  }

  render() {
    const { items } = this.props;
    return (
      <div className="insert-menu">
        {items.map((item, index) => {
          return (
            <button
              type="button"
              className={`${
                index === this.state.selectedIndex ? "active" : ""
              }`}
              {...item.attrs}
              key={index}
              onClick={() => this.selectItem(index)}
            >
              {item.element || item.title}
            </button>
          );
        })}
      </div>
    );
  }
}

interface CommandProps {
  title: string;
  attrs: any;
  command: (a: { editor: Editor; range: Range; props: any }) => void;
}

const CommandsPlugin = Extension.create({
  name: "insertMenu",
  addProseMirrorPlugins() {
    return [
      Suggestion<CommandProps>({
        editor: this.editor,
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range, props });
        },
        items: ({ query }) => {
          return (
            [
              {
                title: "Heading",
                attrs: {
                  "data-test-id": "insert-heading1",
                },
                command: ({ editor }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setNode("heading", { level: 1 })
                    .run();
                },
              },
              {
                title: "Subheading",
                attrs: {
                  "data-test-id": "insert-heading2",
                },
                command: ({ editor }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setNode("heading", { level: 2 })
                    .run();
                },
              },
              {
                title: "Small Subheading",
                attrs: {
                  "data-test-id": "insert-heading3",
                },
                command: ({ editor }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setNode("heading", { level: 3 })
                    .run();
                },
              },
              {
                title: "Quote",
                attrs: {
                  "data-test-id": "insert-quote",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setBlockquote()
                    .run();
                },
              },
              {
                title: "Image",
                attrs: {
                  "data-test-id": "insert-image",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .insertContentAt(from, { type: "imagePlaceholder" })
                    .run();
                },
              },
              {
                title: "Video",
                attrs: {
                  "data-test-id": "insert-video",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .insertContentAt(from, { type: "videoPlaceholder" })
                    .run();
                },
              },
            ] as CommandProps[]
          )
            .filter((item) => {
              return item.title.toLowerCase().startsWith(query.toLowerCase());
            })
            .slice(0, 10);
        },
        startOfLine: true,
        allow: ({ state, range, editor }) => {
          const node = state.selection.$from.node();
          if (!node) return false;
          return node.textBetween(0, 1) === "/";
        },
        render: () => {
          let component: ReactRenderer<CommandsView, any>, popup: Instance<any>;
          return {
            onStart: (props) => {
              component = new ReactRenderer(CommandsView, {
                props,
                editor: props.editor,
              });
              popup = tippy(props.editor.options.element, {
                getReferenceClientRect:
                  props.clientRect as GetReferenceClientRect,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate: (props) => {
              component.updateProps(props);
              popup.setProps({
                getReferenceClientRect: props.clientRect,
              });
            },
            onKeyDown: ({ event }) => {
              if (event.key === "Escape") {
                popup.hide();
                return true;
              }
              if (component.ref)
                return component.ref.onKeyDown(event as KeyboardEvent);
              else return true;
            },
            onExit: () => {
              component.destroy();
              popup.destroy();
            },
          };
        },
      }),
    ];
  },
});

export default CommandsPlugin;
