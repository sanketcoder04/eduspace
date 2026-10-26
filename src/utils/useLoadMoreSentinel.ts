import { useEffect, useRef, useState, type RefObject } from "react";

interface UseLoadMoreSentinelOptions {
  /** The scrollable element the sentinel lives in. */
  rootRef: RefObject<HTMLElement | null>;
  /** False while a fetch is in flight, or when there is nothing more to load. */
  enabled: boolean;
  onLoadMore: () => void;
}

/**
 * Calls onLoadMore when the returned ref's element scrolls into view inside
 * `rootRef`. Attach the returned callback ref to a small element at the end
 * of the list.
 *
 * The observer is rebuilt whenever `enabled` flips back to true. An
 * IntersectionObserver only reports CHANGES, so without this a sentinel that
 * is still visible after a page loads (a short page, a tall container) would
 * never fire again and loading would stall. A fresh observer reports its
 * initial state immediately.
 */
export function useLoadMoreSentinel({ rootRef, enabled, onLoadMore }: UseLoadMoreSentinelOptions) {
  const [sentinel, setSentinel] = useState<HTMLElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  });

  useEffect(() => {
    if (!enabled || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMoreRef.current();
      },
      // Start loading a little before the very bottom so scrolling feels continuous.
      { root: rootRef.current, rootMargin: "0px 0px 120px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, enabled, rootRef]);

  return setSentinel;
}
