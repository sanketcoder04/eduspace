export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_PASSWORD_RESET_OTP: "/auth/verify-password-reset-otp",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_OTP: "/auth/resend-otp",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    GOOGLE: "/auth/google",
    GOOGLE_COMPLETE_REGISTRATION: "/auth/google/complete-registration",
  },
  PROFILE: {
    TEACHER: {
      ME: "/profile/teacher/me",
      BASIC_INFO: "/profile/teacher/basic-info",
      EDUCATION: "/profile/teacher/education",
      SUBJECTS: "/profile/teacher/subjects",
      SUBJECT_BY_ID: (subjectId: string) => `/profile/teacher/subjects/${subjectId}`,
      VERIFICATION: "/profile/teacher/verification",
      AVATAR: "/profile/teacher/avatar",
      COVER: "/profile/teacher/cover",
      RESUME: "/profile/teacher/resume",
      CERTIFICATES: "/profile/teacher/certificates",
      CERTIFICATE_BY_ID: (certificateId: string) =>
        `/profile/teacher/certificates/${certificateId}`,
    },
    STUDENT: {
      ME: "/profile/student/me",
      BASIC_INFO: "/profile/student/basic-info",
      EDUCATION: "/profile/student/education",
      VERIFICATION: "/profile/student/verification",
      AVATAR: "/profile/student/avatar",
      COVER: "/profile/student/cover",
      CERTIFICATES: "/profile/student/certificates",
      CERTIFICATE_BY_ID: (certificateId: string) =>
        `/profile/student/certificates/${certificateId}`,
    },
  },
  MEDIA: {
    UPLOAD: "/media/upload",
  },
} as const;
