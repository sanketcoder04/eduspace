import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import type { SuggestionOptions } from "@tiptap/suggestion";
import MentionList, { type MentionListRef } from "./MentionList";
import { searchMentionCandidates } from "../../services/mention.service";

export const mentionSuggestion: Omit<SuggestionOptions, "editor"> = {
  char: "@",

  items: async ({ query }) => {
    return searchMentionCandidates(query);
  },

  render: () => {
    let component: ReactRenderer<MentionListRef>;
    let popup: TippyInstance[];

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, { props, editor: props.editor });

        popup = tippy("body", {
          getReferenceClientRect: () => props.clientRect?.() as DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate: (props) => {
        component.updateProps(props);
        popup[0]?.setProps({ getReferenceClientRect: () => props.clientRect?.() as DOMRect });
      },

      onKeyDown: (props) => {
        if (props.event.key === "Escape") {
          popup[0]?.hide();
          return true;
        }
        return component.ref?.onKeyDown(props) ?? false;
      },

      onExit: () => {
        popup[0]?.destroy();
        component.destroy();
      },
    };
  },
};
