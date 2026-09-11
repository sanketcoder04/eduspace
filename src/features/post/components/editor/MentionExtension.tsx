import Mention from "@tiptap/extension-mention";
import { mentionSuggestion } from "./mentionSuggestion";

/**
 * Renders each mention as <span data-mention-id="{24-char id}" class="mention">@Name</span>
 * — this exact shape is what the backend's HtmlSanitizer allowlist permits
 * and MentionParser's regex extracts. Changing this markup shape without
 * updating both backend classes will silently break mentions.
 */
export const MentionExtension = Mention.configure({
  HTMLAttributes: { class: "mention" },
  renderHTML({ node }) {
    return [
      "span",
      { "data-mention-id": node.attrs.id, class: "mention" },
      `@${node.attrs.label ?? ""}`,
    ];
  },
  suggestion: mentionSuggestion,
});
