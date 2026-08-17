import DocumentPreview from "./DocumentPreview";

interface DocumentThumbnailProps {
  title: string;
  url: string;
  onClick: () => void;
}

export default function DocumentThumbnail({ title, url, onClick }: DocumentThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-32 shrink-0 flex-col gap-1.5 text-left sm:w-36"
    >
      <div className="pointer-events-none w-full overflow-hidden rounded-lg border border-black bg-gray-50 transition group-hover:border-racing-red-300 dark:border-neutral-700 dark:bg-neutral-800 cursor-pointer">
        <DocumentPreview url={url} />
      </div>
      <span className="truncate text-xs font-medium text-gray-600 dark:text-gray-300">{title}</span>
    </button>
  );
}
