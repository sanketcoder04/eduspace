import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type {
  TeacherProfile,
  StudentProfile,
  UpdateTeacherBasicInfoRequest,
  UpdateStudentBasicInfoRequest,
  UpdateEducationListRequest,
  AddSubjectOfferingRequest,
  UpdateSubjectOfferingRequest,
  SubmitVerificationRequest,
} from "../types/profile.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// ---- Teacher ----

export async function getMyTeacherProfile(): Promise<TeacherProfile> {
  const { data } = await api.get<ApiEnvelope<TeacherProfile>>(API_ENDPOINTS.PROFILE.TEACHER.ME);
  return data.data;
}

export async function updateTeacherBasicInfo(
  payload: UpdateTeacherBasicInfoRequest
): Promise<TeacherProfile> {
  const { data } = await api.put<ApiEnvelope<TeacherProfile>>(
    API_ENDPOINTS.PROFILE.TEACHER.BASIC_INFO,
    payload
  );
  return data.data;
}

export async function updateTeacherEducation(
  payload: UpdateEducationListRequest
): Promise<TeacherProfile> {
  const { data } = await api.put<ApiEnvelope<TeacherProfile>>(
    API_ENDPOINTS.PROFILE.TEACHER.EDUCATION,
    payload
  );
  return data.data;
}

export async function addSubjectOffering(
  payload: AddSubjectOfferingRequest
): Promise<TeacherProfile> {
  const { data } = await api.post<ApiEnvelope<TeacherProfile>>(
    API_ENDPOINTS.PROFILE.TEACHER.SUBJECTS,
    payload
  );
  return data.data;
}

export async function updateSubjectOffering(
  subjectId: string,
  payload: UpdateSubjectOfferingRequest
): Promise<TeacherProfile> {
  const { data } = await api.put<ApiEnvelope<TeacherProfile>>(
    API_ENDPOINTS.PROFILE.TEACHER.SUBJECT_BY_ID(subjectId),
    payload
  );
  return data.data;
}

export async function deleteSubjectOffering(subjectId: string): Promise<TeacherProfile> {
  const { data } = await api.delete<ApiEnvelope<TeacherProfile>>(
    API_ENDPOINTS.PROFILE.TEACHER.SUBJECT_BY_ID(subjectId)
  );
  return data.data;
}

export async function submitTeacherVerification(
  payload: SubmitVerificationRequest
): Promise<TeacherProfile> {
  const { data } = await api.post<ApiEnvelope<TeacherProfile>>(
    API_ENDPOINTS.PROFILE.TEACHER.VERIFICATION,
    payload
  );
  return data.data;
}

// ---- Student ----

export async function getMyStudentProfile(): Promise<StudentProfile> {
  const { data } = await api.get<ApiEnvelope<StudentProfile>>(API_ENDPOINTS.PROFILE.STUDENT.ME);
  return data.data;
}

export async function updateStudentBasicInfo(
  payload: UpdateStudentBasicInfoRequest
): Promise<StudentProfile> {
  const { data } = await api.put<ApiEnvelope<StudentProfile>>(
    API_ENDPOINTS.PROFILE.STUDENT.BASIC_INFO,
    payload
  );
  return data.data;
}

export async function updateStudentEducation(
  payload: UpdateEducationListRequest
): Promise<StudentProfile> {
  const { data } = await api.put<ApiEnvelope<StudentProfile>>(
    API_ENDPOINTS.PROFILE.STUDENT.EDUCATION,
    payload
  );
  return data.data;
}

export async function submitStudentVerification(
  payload: SubmitVerificationRequest
): Promise<StudentProfile> {
  const { data } = await api.post<ApiEnvelope<StudentProfile>>(
    API_ENDPOINTS.PROFILE.STUDENT.VERIFICATION,
    payload
  );
  return data.data;
}
