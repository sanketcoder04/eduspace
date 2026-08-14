import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { MediaFolder } from "../types/profile.types";

interface UploadResponse {
  success: boolean;
  message: string;
  data: { url: string };
}

export async function uploadMedia(file: File, folder: MediaFolder): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const { data } = await api.post<UploadResponse>(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data.url;
}
