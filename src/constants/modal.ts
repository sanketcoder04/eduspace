import type { CSSProperties } from "react";

/**
 * Shared AntD Modal body styling — caps the scrollable area so tall content
 * (forms, previews, anything long) scrolls *inside* the modal instead of
 * growing the whole modal past the viewport. Pair with the `centered` prop
 * on every Modal so it's vertically centered as one fixed-size unit rather
 * than glued to the top of the screen with an awkward gap below it.
 */
export const MODAL_BODY_SCROLL_STYLE: { body: CSSProperties } = {
  body: {
    maxHeight: "70vh",
    overflowY: "auto",
    paddingRight: 8,
  },
};
