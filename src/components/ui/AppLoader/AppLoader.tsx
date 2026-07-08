import { Spin } from "antd";
import type { AppLoaderProps } from "./types";

export default function AppLoader({ fullscreen = false, text = "Loading..." }: AppLoaderProps) {
  return (
    <div
      className={`
        flex items-center justify-center
        ${fullscreen ? "fixed inset-0 bg-white/70 backdrop-blur-sm z-50" : "py-10"}
      `}
    >
      <div className="flex flex-col items-center gap-4">
        <Spin size="large" />

        <span className="text-sm text-gray-500">{text}</span>
      </div>
    </div>
  );
}
