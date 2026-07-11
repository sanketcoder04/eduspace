import { GraduationCap } from "lucide-react";
import { Typography } from "antd";

import type { AppLogoProps } from "./types";

const { Title, Text } = Typography;

const sizes = {
  sm: {
    container: "h-10 w-10",
    icon: 20,
    title: "text-lg",
    subtitle: "text-[10px]",
  },
  md: {
    container: "h-14 w-14",
    icon: 28,
    title: "text-xl",
    subtitle: "text-xs",
  },
  lg: {
    container: "h-20 w-20",
    icon: 38,
    title: "text-2xl",
    subtitle: "text-sm",
  },
};

export default function AppLogo({ size = "md", showText = true }: AppLogoProps) {
  const current = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          ${current.container}
          flex items-center justify-center
          rounded-2xl
          bg-linear-to-br
          from-racing-red-400
          via-racing-red-500
          to-racing-red-700
          shadow-lg
        `}
      >
        <GraduationCap size={current.icon} className="text-white!" />
      </div>

      {showText && (
        <div>
          <Title level={4} className={`mb-0! ${current.title} text-white!`}>
            EduHub
          </Title>

          <Text className={`text-white! ${current.subtitle}`}>Learn • Teach • Grow</Text>
        </div>
      )}
    </div>
  );
}
