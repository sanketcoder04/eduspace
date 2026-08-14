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

  SEARCH: "/search",

  SETTINGS: "/settings",
} as const;
