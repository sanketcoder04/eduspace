import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Result, Spin } from "antd";
import { useConversations } from "@/features/chat/hooks/useConversations";
import { ROUTES } from "@/router/routes";

export default function ConversationByApplicationRedirectPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  // Conversation.applicationId isn't exposed via a dedicated backend lookup
  // endpoint — resolved client-side against the already-fetched list instead
  // of adding new backend surface for a single redirect (see Part 6 notes).
  const { data: conversationsPage, isLoading } = useConversations({ page: 0, size: 100 });

  const conversation = conversationsPage?.content.find((c) => c.applicationId === applicationId);

  useEffect(() => {
    if (conversation) {
      navigate(ROUTES.CONVERSATION_DETAIL(conversation.id), { replace: true });
    }
  }, [conversation, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Result
          status="404"
          title="Conversation not found"
          subTitle="This application may not have been approved yet, or the chat hasn't started."
        />
      </div>
    );
  }

  return null; // redirect effect handles navigation once resolved
}
