interface PostContentProps {
  html?: string;
  className?: string;
}

/** Reuses the same .ProseMirror-content CSS scope the editor uses, so lists/mentions render identically whether shown inside the editor or here, read-only. */
export default function PostContent({ html, className = "" }: PostContentProps) {
  if (!html) return null;
  return (
    <div
      className={`ProseMirror-content prose prose-sm max-w-none text-gray-800 dark:text-gray-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
