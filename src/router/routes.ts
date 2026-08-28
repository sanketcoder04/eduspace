export const ROUTES = {
  HOME: "/",

  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  GOOGLE_SELECT_ROLE: "/google/select-role",

  DASHBOARD: "/dashboard",

  COMPLETE_PROFILE: "/profile/complete",
  PROFILE: "/profile",
  PROFILE_BY_ID: (userId: string) => `/profile/${userId}`,

  OPPORTUNITIES: "/opportunities",
  OPPORTUNITY_DETAIL: (id: string) => `/opportunities/${id}`,
  CREATE_TEACHING_OPENING: "/opportunities/new/teaching-opening",
  CREATE_TUITION_REQUIREMENT: "/opportunities/new/tuition-requirement",

  SEARCH: "/search",

  SETTINGS: "/settings",
} as const;
