import { FileText } from "lucide-react";

interface DocumentPreviewProps {
  url: string;
  className?: string;
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function isImageUrl(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

export default function DocumentPreview({ url, className = "" }: DocumentPreviewProps) {
  if (isImageUrl(url)) {
    return <img src={url} alt="" className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    <div className="h-full w-full overflow-hidden bg-white">
      <object
        data={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
        type="application/pdf"
        className={`h-full w-full ${className}`}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-racing-red-50 text-racing-red-500 dark:bg-racing-red-950">
          <FileText size={28} />
          <span className="text-xs font-medium">PDF</span>
        </div>
      </object>
    </div>
  );
}
