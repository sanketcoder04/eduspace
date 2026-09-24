import { useState } from "react";
import { Modal } from "antd";

interface PostMediaGalleryProps {
  mediaUrls: string[];
  type: "IMAGE" | "VIDEO";
}

export default function PostMediaGallery({ mediaUrls, type }: PostMediaGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (type === "VIDEO") {
    return (
      <video
        src={mediaUrls[0]}
        controls
        className="max-h-120 w-full rounded-xl bg-black object-contain"
      />
    );
  }

  const count = mediaUrls.length;
  const gridClass =
    count === 1
      ? "grid-cols-1"
      : count === 2
        ? "grid-cols-2"
        : count === 3
          ? "grid-cols-2"
          : "grid-cols-2";

  return (
    <>
      <div className={`grid gap-1 overflow-hidden rounded-xl ${gridClass}`}>
        {mediaUrls.slice(0, 4).map((url, index) => {
          const isLastVisible = index === 3 && count > 4;
          return (
            <button
              key={url}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className={`relative ${count === 3 && index === 0 ? "row-span-2" : ""}`}
            >
              <img src={url} alt="" className="h-full max-h-72 w-full object-cover" />
              {isLastVisible && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                  +{count - 4}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <Modal
        open={lightboxIndex !== null}
        onCancel={() => setLightboxIndex(null)}
        footer={null}
        centered
        width="min(90vw, 800px)"
      >
        {lightboxIndex !== null && (
          <img
            src={mediaUrls[lightboxIndex]}
            alt=""
            className="max-h-[80vh] w-full object-contain"
          />
        )}
      </Modal>
    </>
  );
}
