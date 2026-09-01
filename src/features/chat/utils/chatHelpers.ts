import type { ConversationResponse } from "../types/chat.types";

export interface ChatParty {
  id: string;
  name: string;
  avatarUrl?: string;
}

/** A conversation only stores author/applicant fields, not a generic "other party" — this derives it relative to whoever's currently logged in. */
export function getOtherParty(
  conversation: ConversationResponse,
  currentUserId: string | undefined
): ChatParty {
  if (conversation.authorId === currentUserId) {
    return {
      id: conversation.applicantId,
      name: conversation.applicantName,
      avatarUrl: conversation.applicantAvatarUrl,
    };
  }
  return {
    id: conversation.authorId,
    name: conversation.authorName,
    avatarUrl: conversation.authorAvatarUrl,
  };
}
