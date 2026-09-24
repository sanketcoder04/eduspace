import { useState } from "react";
import { Button, message } from "antd";
import { CheckCircle2 } from "lucide-react";
import { useVoteOnPoll } from "../../hooks/useVoteOnPoll";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { PollData } from "../../types/post.types";

interface PostPollCardProps {
  postId: string;
  poll: PollData;
  viewerSelectedOptionIds?: string[];
}

export default function PostPollCard({ postId, poll, viewerSelectedOptionIds }: PostPollCardProps) {
  const [pendingSelection, setPendingSelection] = useState<string[]>([]);
  const voteMutation = useVoteOnPoll();

  const hasVoted = !!viewerSelectedOptionIds && viewerSelectedOptionIds.length > 0;
  const canVote = !hasVoted && !poll.expired;

  const toggleOption = (optionId: string) => {
    if (poll.allowMultipleChoice) {
      setPendingSelection((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      );
    } else {
      setPendingSelection([optionId]);
    }
  };

  const handleSubmit = async () => {
    if (pendingSelection.length === 0) return;
    try {
      await voteMutation.mutateAsync({ postId, payload: { selectedOptionIds: pendingSelection } });
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't submit your vote."));
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-gray-200 p-4 dark:border-neutral-700">
      {poll.options.map((option) => {
        const isMine = viewerSelectedOptionIds?.includes(option.id);
        const isPending = pendingSelection.includes(option.id);

        if (canVote) {
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleOption(option.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                isPending
                  ? "border-racing-red-400 bg-racing-red-50 dark:bg-racing-red-950"
                  : "border-gray-200 hover:border-racing-red-300 dark:border-neutral-700"
              }`}
            >
              {option.text}
              {isPending && <CheckCircle2 size={16} className="text-racing-red-500" />}
            </button>
          );
        }

        return (
          <div
            key={option.id}
            className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-700"
          >
            <div
              className="absolute inset-y-0 left-0 bg-racing-red-50 dark:bg-racing-red-950"
              style={{ width: `${option.votePercentage}%` }}
            />
            <div className="relative flex items-center justify-between px-3 py-2 text-sm">
              <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
                {isMine && <CheckCircle2 size={14} className="text-racing-red-500" />}
                {option.text}
              </span>
              <span className="font-medium text-gray-500">{option.votePercentage}%</span>
            </div>
          </div>
        );
      })}

      {canVote && (
        <Button
          type="primary"
          size="small"
          disabled={pendingSelection.length === 0}
          loading={voteMutation.isPending}
          onClick={handleSubmit}
          className="rounded-lg font-semibold"
        >
          Vote
        </Button>
      )}

      <p className="pt-1 text-xs text-gray-400">
        {poll.totalVotes} vote{poll.totalVotes === 1 ? "" : "s"}
        {poll.expired
          ? " · Poll closed"
          : poll.expiresAt
            ? ` · Ends ${new Date(poll.expiresAt).toLocaleDateString()}`
            : ""}
      </p>
    </div>
  );
}
