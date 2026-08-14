import { useMutation } from "@tanstack/react-query";
import { uploadMedia } from "../services/media.service";
import type { MediaFolder } from "../types/profile.types";

export function useUploadMedia() {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder: MediaFolder }) =>
      uploadMedia(file, folder),
  });
}
