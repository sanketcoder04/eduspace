import { Skeleton } from "antd";
import { useTopLevelComments } from "../../hooks/useTopLevelComments";
import CommentComposer from "./CommentComposer";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data, isLoading } = useTopLevelComments(postId, { page: 0, size: 20 });

  return (
    <div className="mt-3 space-y-3 border-t border-gray-100 pt-3 dark:border-neutral-800">
      <CommentComposer postId={postId} />

      {isLoading ? (
        <Skeleton active avatar paragraph={{ rows: 1 }} />
      ) : (
        data?.content.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))
      )}
    </div>
  );
}
