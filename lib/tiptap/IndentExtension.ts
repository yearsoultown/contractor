import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export const IndentExtension = Extension.create({
  name: 'indent',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          indent: {
            default: 0,
            parseHTML: (el) => {
              const val = el.style.marginLeft || el.style.paddingLeft;
              if (!val) return 0;
              return Math.round(parseInt(val) / 24);
            },
            renderHTML: (attrs) => {
              if (!attrs.indent) return {};
              return { style: `margin-left: ${attrs.indent * 24}px` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;
          let changed = false;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (['paragraph', 'heading'].includes(node.type.name)) {
              const currentIndent = node.attrs.indent ?? 0;
              if (currentIndent < 10) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: currentIndent + 1 });
                changed = true;
              }
            }
          });

          if (changed && dispatch) dispatch(tr);
          return changed;
        },

      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;
          let changed = false;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (['paragraph', 'heading'].includes(node.type.name)) {
              const currentIndent = node.attrs.indent ?? 0;
              if (currentIndent > 0) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: currentIndent - 1 });
                changed = true;
              }
            }
          });

          if (changed && dispatch) dispatch(tr);
          return changed;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),
    };
  },
});