import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { Page, PageableParams } from "@/types/api.types";
import type { CommentResponse, CreateCommentRequest } from "../types/post.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function toPageParams(params?: PageableParams) {
  return { page: params?.page ?? 0, size: params?.size ?? 20 };
}

export async function createComment(
  postId: string,
  payload: CreateCommentRequest
): Promise<CommentResponse> {
  const { data } = await api.post<ApiEnvelope<CommentResponse>>(
    API_ENDPOINTS.POST.COMMENTS(postId),
    payload
  );
  return data.data;
}

export async function getTopLevelComments(
  postId: string,
  pageable?: PageableParams
): Promise<Page<CommentResponse>> {
  const { data } = await api.get<ApiEnvelope<Page<CommentResponse>>>(
    API_ENDPOINTS.POST.COMMENTS(postId),
    {
      params: toPageParams(pageable),
    }
  );
  return data.data;
}

export async function getReplies(
  commentId: string,
  pageable?: PageableParams
): Promise<Page<CommentResponse>> {
  const { data } = await api.get<ApiEnvelope<Page<CommentResponse>>>(
    API_ENDPOINTS.COMMENT.REPLIES(commentId),
    {
      params: toPageParams(pageable),
    }
  );
  return data.data;
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(API_ENDPOINTS.COMMENT.BY_ID(id));
}

export async function toggleCommentLike(id: string): Promise<boolean> {
  const { data } = await api.post<ApiEnvelope<boolean>>(API_ENDPOINTS.COMMENT.LIKE(id));
  return data.data;
}
