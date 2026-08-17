import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DocumentThumbnail from "./DocumentThumbnail";

export interface DocumentItem {
  key: string;
  title: string;
  url: string;
}

interface DocumentsCarouselProps {
  items: DocumentItem[];
  onSelect: (index: number) => void;
}

export default function DocumentsCarousel({ items, onSelect }: DocumentsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);

      setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    el.addEventListener("scroll", update, { passive: true });

    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [items]);

  return (
    <div className="relative min-w-0 w-full">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => {
            const amount = -(scrollRef.current?.clientWidth ?? 220) * 0.8;

            scrollBy(amount);
          }}
          className="absolute left-0 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white p-1.5 shadow-md hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex min-w-0 w-full gap-3 overflow-x-auto overflow-y-hidden pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <div key={item.key} className="flex-none">
            <DocumentThumbnail title={item.title} url={item.url} onClick={() => onSelect(index)} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => {
            const amount = (scrollRef.current?.clientWidth ?? 220) * 0.8;

            scrollBy(amount);
          }}
          className="absolute right-0 top-1/2 z-10 flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white p-1.5 shadow-md hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
