import { forwardRef, useImperativeHandle } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { MentionExtension } from "./MentionExtension";
import EditorToolbar from "./EditorToolbar";

export interface RichTextEditorRef {
  clear: () => void;
  isEmpty: () => boolean;
}

interface RichTextEditorProps {
  onChange: (html: string) => void;
  placeholder?: string;
  minHeightClassName?: string;
  showToolbar?: boolean;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    {
      onChange,
      placeholder = "What's on your mind?",
      minHeightClassName = "min-h-[120px]",
      showToolbar = true,
    },
    ref
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          // Only what the backend allowlist accepts survives sanitization
          // anyway — disabling the rest here keeps the toolbar honest about
          // what actually gets persisted, rather than offering formatting
          // that would silently vanish on save.
          heading: false,
          codeBlock: false,
          blockquote: false,
          horizontalRule: false,
          strike: false,
        }),
        Underline,
        Placeholder.configure({ placeholder }),
        MentionExtension,
      ],
      editorProps: {
        attributes: {
          class: `ProseMirror-content prose prose-sm max-w-none focus:outline-none ${minHeightClassName} px-3 py-2`,
        },
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      clear: () => editor?.commands.clearContent(true),
      isEmpty: () => editor?.isEmpty ?? true,
    }));

    if (!editor) return null;

    return (
      <div className="rounded-xl border border-gray-200 dark:border-neutral-700">
        {showToolbar && <EditorToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
