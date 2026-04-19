import { Node, mergeAttributes } from '@tiptap/core';

export interface VariableNodeAttrs {
  id: string;
  label: string;
  value?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (attrs: VariableNodeAttrs) => ReturnType;
      setVariableValue: (id: string, value: string) => ReturnType;
    };
  }
}

export const VariableNode = Node.create({
  name: 'variable',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      id: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-variable-id') ?? '',
        renderHTML: (attrs) => ({ 'data-variable-id': attrs.id }),
      },
      label: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-variable-label') ?? el.textContent ?? '',
        renderHTML: (attrs) => ({ 'data-variable-label': attrs.label }),
      },
      value: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-variable-value') ?? '',
        renderHTML: (attrs) => {
          if (!attrs.value) return {};
          return { 'data-variable-value': attrs.value };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-variable-id]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const value = HTMLAttributes['data-variable-value'];
    const label = HTMLAttributes['data-variable-label'] ?? HTMLAttributes['data-variable-id'];
    const display = value || `[${label}]`;
    const cls = value ? 'variable-badge variable-badge--filled' : 'variable-badge variable-badge--empty';
    return ['span', mergeAttributes(HTMLAttributes, { class: cls }), display];
  },

  addCommands() {
    return {
      insertVariable:
        (attrs: VariableNodeAttrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
      setVariableValue:
        (id: string, value: string) =>
        ({ tr, state, dispatch }) => {
          let found = false;
          state.doc.descendants((node, pos) => {
            if (node.type.name === 'variable' && node.attrs.id === id) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, value });
              found = true;
            }
          });
          if (found && dispatch) dispatch(tr);
          return found;
        },
    };
  },
});