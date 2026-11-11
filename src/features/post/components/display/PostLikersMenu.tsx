import { useState } from "react";
import { Dropdown, Drawer, Grid } from "antd";
import PostLikersList from "./PostLikersList";

const { useBreakpoint } = Grid;

interface PostLikersMenuProps {
  postId: string;
  likesCount: number;
}

const COUNT_BUTTON_CLASS =
  "rounded-lg py-1.5 pl-1 pr-3 text-sm font-medium tabular-nums transition cursor-pointer";

export default function PostLikersMenu({ postId, likesCount }: PostLikersMenuProps) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  const screens = useBreakpoint();
  const isDesktop = !!screens.sm;

  const handleOpenChange = (next: boolean) => {
    if (next) setSession((current) => current + 1);
    setOpen(next);
  };
  const close = () => setOpen(false);

  const label = `${likesCount} ${likesCount === 1 ? "like" : "likes"}. See who liked this post`;

  if (isDesktop) {
    return (
      <Dropdown
        open={open}
        onOpenChange={handleOpenChange}
        trigger={["click"]}
        placement="bottomLeft"
        popupRender={() => (
          <div className="w-72 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 dark:border-neutral-800 dark:text-white">
              Likes · {likesCount}
            </div>
            <PostLikersList
              key={session}
              postId={postId}
              enabled={open}
              scrollClassName="max-h-72"
              onNavigate={close}
            />
          </div>
        )}
      >
        <button type="button" aria-label={label} className={COUNT_BUTTON_CLASS}>
          {likesCount}
        </button>
      </Dropdown>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={() => handleOpenChange(true)}
        className={COUNT_BUTTON_CLASS}
      >
        {likesCount}
      </button>

      <Drawer
        title={`Likes · ${likesCount}`}
        placement="bottom"
        size="60vh"
        open={open}
        onClose={close}
        styles={{ body: { padding: 0 } }}
      >
        <PostLikersList
          key={session}
          postId={postId}
          enabled={open}
          scrollClassName="max-h-[calc(60vh-105px)]"
          onNavigate={close}
        />
      </Drawer>
    </>
  );
}
