import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { toYouTubeEmbedUrl } from "@/utils/function/extractYouTubeEmbedUrl";

const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtube: {
      insertYouTube: (src: string) => ReturnType;
    };
  }
}

export const YouTube = Node.create({
  name: "youtube",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: "YouTube video",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-embed]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-youtube-embed": "true",
        class: "my-3 overflow-hidden rounded-xl border border-border",
      }),
      [
        "div",
        { class: "aspect-video w-full" },
        [
          "iframe",
          {
            src: HTMLAttributes.src,
            title: HTMLAttributes.title ?? "YouTube video",
            class: "h-full w-full",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            referrerpolicy: "strict-origin-when-cross-origin",
            allowfullscreen: "true",
          },
        ],
      ],
    ];
  },

  addCommands() {
    return {
      insertYouTube:
        (src: string) =>
        ({ commands }) => {
          if (!src) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: {
              src,
            },
          });
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const pastedText = event.clipboardData?.getData("text/plain");
            if (!pastedText) {
              return false;
            }

            const matches = Array.from(pastedText.matchAll(URL_REGEX));
            if (matches.length === 0) {
              return false;
            }

            const hasYouTube = matches.some((match) => Boolean(toYouTubeEmbedUrl(match[0] ?? "")));
            if (!hasYouTube) {
              return false;
            }

            event.preventDefault();

            const editor = this.editor;
            let lastIndex = 0;

            for (const match of matches) {
              const url = match[0] ?? "";
              const index = match.index ?? 0;
              const beforeText = pastedText.slice(lastIndex, index);
              if (beforeText) {
                editor.commands.insertContent(beforeText);
              }

              const embedUrl = toYouTubeEmbedUrl(url);
              if (embedUrl) {
                editor.commands.insertContent({
                  type: this.name,
                  attrs: { src: embedUrl },
                });
              } else {
                editor.commands.insertContent(url);
              }

              lastIndex = index + url.length;
            }

            const tailText = pastedText.slice(lastIndex);
            if (tailText) {
              editor.commands.insertContent(tailText);
            }

            return true;
          },
        },
      }),
    ];
  },
});

export default YouTube;
