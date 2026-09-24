import PostComposerTrigger from "@/features/post/components/composer/PostComposerTrigger";
import PostFeedList from "@/features/post/components/PostFeedList";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4">
        <PostComposerTrigger />
      </div>

      <PostFeedList />
    </div>
  );
}
