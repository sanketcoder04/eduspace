import type { Role } from "@/features/auth/types/user.types";

export type PostType = "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "POLL";

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
  votePercentage: number;
}

export interface PollData {
  options: PollOption[];
  allowMultipleChoice: boolean;
  expiresAt?: string;
  totalVotes: number;
  expired: boolean;
}

export interface PostResponse {
  id: string;

  authorId: string;
  authorRole: Role;
  authorName: string;
  authorAvatarUrl?: string;

  type: PostType;
  content?: string; // sanitized HTML — safe to render directly

  mediaUrls?: string[];
  documentUrl?: string;
  documentFileName?: string;

  poll?: PollData;

  mentions: string[];

  likesCount: number;
  commentsCount: number;

  likedByViewer: boolean;
  viewerSelectedOptionIds?: string[];

  edited: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  type: PostType;
  content?: string;
  mediaUrls?: string[];
  documentUrl?: string;
  documentFileName?: string;
  pollOptions?: string[];
  pollAllowMultipleChoice?: boolean;
  pollExpiresAt?: string;
}

export interface VoteRequest {
  selectedOptionIds: string[];
}

export interface CommentResponse {
  id: string;
  postId: string;

  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;

  content: string;
  mentions: string[];

  parentCommentId?: string;
  repliesCount: number;

  likesCount: number;
  likedByViewer: boolean;

  edited: boolean;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface MentionCandidate {
  id: string;
  name: string;
  role: Role;
}
