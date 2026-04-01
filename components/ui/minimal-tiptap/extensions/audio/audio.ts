import { mergeAttributes, Node } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audioEmbed: {
      insertAudioEmbed: (src: string) => ReturnType;
    };
  }
}

export const AudioEmbed = Node.create({
  name: "audioEmbed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-audio-embed]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-audio-embed": "true",
        class: "my-3 overflow-hidden rounded-xl border border-border p-2",
      }),
      [
        "audio",
        {
          src: HTMLAttributes.src,
          controls: "true",
          preload: "none",
          class: "w-full",
        },
      ],
    ];
  },

  addCommands() {
    return {
      insertAudioEmbed:
        (src: string) =>
        ({ commands }) => {
          if (!src) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: { src },
          });
        },
    };
  },
});

export default AudioEmbed;
