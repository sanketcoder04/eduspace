import { Home, Briefcase, Send, MessageCircle, ChartLine } from "lucide-react";
import { ROUTES } from "@/router/routes";

export interface NavLinkItem {
  label: string;
  to: string;
  icon: typeof Home;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", to: ROUTES.HOME, icon: Home },
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: ChartLine },
  { label: "Opportunities", to: ROUTES.OPPORTUNITIES, icon: Briefcase },
  { label: "Applications", to: ROUTES.APPLICATIONS, icon: Send },
  { label: "Chat", to: ROUTES.CONVERSATIONS, icon: MessageCircle },
];
