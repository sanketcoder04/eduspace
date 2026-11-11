import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { Search, X } from "lucide-react";
import { useDebouncedValue } from "@/utils/useDebouncedValue";
import { useLoadMoreSentinel } from "@/utils/useLoadMoreSentinel";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { MIN_SEARCH_LENGTH, useUserSearch } from "../hooks/useUserSearch";
import { useSearchFollowToggle } from "../hooks/useSearchFollowToggle";
import UserSearchResultItem from "./UserSearchResultItem";
import { ROUTES } from "@/router/routes";
import type { UserSearchResult } from "../types/search.types";

export default function UserSearchBar() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const debouncedQuery = useDebouncedValue(query, 300);
  const { data, isFetching, isFetchingNextPage, isPlaceholderData, hasNextPage, fetchNextPage } =
    useUserSearch(debouncedQuery);
  const followToggle = useSearchFollowToggle();

  // Flatten the loaded pages. De-duped by id: offset pagination can repeat a
  // row if someone signs up or renames between two page loads.
  const results = useMemo(() => {
    const unique = new Map<string, UserSearchResult>();
    data?.pages.forEach((page) =>
      page.content.forEach((user) => {
        if (!unique.has(user.userId)) unique.set(user.userId, user);
      })
    );
    return [...unique.values()];
  }, [data]);

  const isSearching = query.trim().length >= MIN_SEARCH_LENGTH;

  const isSettling = debouncedQuery.trim() !== query.trim() || (isFetching && !isFetchingNextPage);
  const showPanel = open && isSearching;

  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const pendingFollowUserId = followToggle.isPending ? followToggle.variables?.userId : undefined;

  const setSentinel = useLoadMoreSentinel({
    rootRef: panelRef,
    // Never load "more" of a placeholder (the previous query's leftovers).
    enabled: showPanel && !!hasNextPage && !isFetchingNextPage && !isPlaceholderData,
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  // A new search starts at the top of the list.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [debouncedQuery]);

  // Close when clicking or tapping outside the search area.
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const reset = () => {
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
  };

  const moveActive = (next: number) => {
    setActiveIndex(next);
    // The row already exists in the DOM, so it can be scrolled to right away.
    panelRef.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: "nearest" });
  };

  const handleToggleFollow = (user: UserSearchResult) => {
    followToggle.mutate(
      { userId: user.userId, follow: !user.following },
      {
        onError: (error) =>
          message.error(getErrorMessage(error, "Couldn't update follow. Please try again.")),
      }
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (safeIndex + 1 < results.length) moveActive(safeIndex + 1);
      else if (!hasNextPage) moveActive(0); // wrap only when truly at the end of all results
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (safeIndex > 0) moveActive(safeIndex - 1);
      else if (!hasNextPage) moveActive(results.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[safeIndex];
      if (target) {
        reset();
        navigate(ROUTES.PROFILE_BY_ID(target.userId));
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-racing-red-400 dark:border-neutral-800 dark:bg-neutral-900">
        <Search size={16} className="shrink-0 text-gray-400" />
        <input
          type="text"
          aria-label="Search people"
          aria-expanded={showPanel}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search people"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-gray-400 lg:text-sm dark:text-white"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={reset}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showPanel && (
        <div
          ref={panelRef}
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          {results.map((user, index) => (
            <UserSearchResultItem
              key={user.userId}
              user={user}
              index={index}
              isActive={index === safeIndex}
              isFollowPending={pendingFollowUserId === user.userId}
              onHover={() => setActiveIndex(index)}
              onSelect={reset}
              onToggleFollow={handleToggleFollow}
            />
          ))}

          {hasNextPage && (
            <div ref={setSentinel} className="flex h-10 items-center justify-center">
              {isFetchingNextPage && results.length > 0 && <Spin size="small" />}
            </div>
          )}

          {results.length === 0 && (isSettling || hasNextPage) && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
              <Spin size="small" /> Searching...
            </div>
          )}

          {results.length === 0 && !isSettling && !hasNextPage && (
            <p className="px-3 py-4 text-center text-sm text-gray-400">
              No people found for "{debouncedQuery.trim()}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
