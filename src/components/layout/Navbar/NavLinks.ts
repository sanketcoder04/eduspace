import { Home, Briefcase, Send, MessageCircle } from "lucide-react";
import { ROUTES } from "@/router/routes";

export interface NavLinkItem {
  label: string;
  to: string;
  icon: typeof Home;
}

/** Single source of truth for both the desktop top bar and the mobile bottom tab bar. */
export const NAV_LINKS: NavLinkItem[] = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: Home },
  { label: "Opportunities", to: ROUTES.OPPORTUNITIES, icon: Briefcase },
  { label: "Applications", to: ROUTES.APPLICATIONS, icon: Send },
  { label: "Chat", to: ROUTES.CONVERSATIONS, icon: MessageCircle },
];
