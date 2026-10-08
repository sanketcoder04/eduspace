/**
 * Converts sanitized post/comment HTML to plain text for previews.
 *
 * A regex tag-strip leaves HTML entities untouched (the backend sanitizer
 * encodes ' as &#39; and @ as &#64;), so the text is parsed with the
 * browser's own HTML parser instead, which strips markup and decodes
 * entities together. DOMParser documents are inert: no scripts execute and
 * no resources load.
 */
export function htmlToPlainText(html?: string | null): string {
  if (!html) return "";

  const spaced = html.replace(/<\/(p|li|div)>|<br\s*\/?>/gi, " ");

  const doc = new DOMParser().parseFromString(spaced, "text/html");
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}
