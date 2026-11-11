import DocumentPreview from "@/features/profile/components/display/DocumentPreview";
import { FileText, ExternalLink } from "lucide-react";

interface PostDocumentCardProps {
  documentUrl: string;
  documentFileName?: string;
}

export default function PostDocumentCard({ documentUrl, documentFileName }: PostDocumentCardProps) {
  return (
    <a
      href={documentUrl}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col xl:flex-row items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-racing-red-300 dark:border-neutral-700"
    >
      <div className="flex items-center justify-center">
        <DocumentPreview url={documentUrl} className="w-40!" />
      </div>
      <div className="flex gap-1 w-full h-full">
        <FileText size={22} className="shrink-0 text-racing-red-500" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700 dark:text-gray-200">
          {documentFileName ?? "Document"}
        </span>
        <ExternalLink size={16} className="shrink-0 text-gray-400" />
      </div>
    </a>
  );
}
