import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../services/post.service";

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["posts", "detail", id],
    queryFn: () => getPostById(id as string),
    enabled: !!id,
  });
}
