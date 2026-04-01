import { mergeAttributes, Node } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      insertVideoEmbed: (src: string, width?: number, height?: number) => ReturnType;
    };
  }
}

export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const value = Number(element.getAttribute("data-video-width"));
          return Number.isFinite(value) && value > 0 ? value : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return { "data-video-width": String(attributes.width) };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const value = Number(element.getAttribute("data-video-height"));
          return Number.isFinite(value) && value > 0 ? value : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return { "data-video-height": String(attributes.height) };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-embed]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const width = Number(HTMLAttributes.width);
    const height = Number(HTMLAttributes.height);
    const hasValidRatio = Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
    const ratioStyle = hasValidRatio ? `aspect-ratio:${width} / ${height};` : "aspect-ratio:16 / 9;";

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-video-embed": "true",
        class: "my-3 overflow-hidden rounded-xl border border-border p-2",
      }),
      [
        "div",
        { class: "video-frame w-full overflow-hidden rounded bg-black/5", style: ratioStyle },
        [
          "video",
          {
            src: HTMLAttributes.src,
            controls: "true",
            preload: "none",
            class: "h-full w-full object-contain bg-black",
          },
        ],
      ],
    ];
  },

  addCommands() {
    return {
      insertVideoEmbed:
        (src: string, width?: number, height?: number) =>
        ({ commands }) => {
          if (!src) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: { src, width: width ?? null, height: height ?? null },
          });
        },
    };
  },
});

export default VideoEmbed;
