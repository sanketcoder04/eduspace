import type { ThemeConfig } from "antd";
import { COLORS } from "./colors";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: COLORS.racingRed[500],
    colorInfo: COLORS.racingRed[500],
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",

    borderRadius: 12,

    controlHeight: 48,

    fontFamily: "Montserrat, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 12,
      controlHeight: 48,
      fontWeight: 600,
    },

    Input: {
      controlHeight: 48,
      borderRadius: 12,
      activeBorderColor: COLORS.racingRed[500],
      hoverBorderColor: COLORS.racingRed[500],
    },

    Card: {
      borderRadiusLG: 24,
    },

    Typography: {
      titleMarginBottom: 0,
      fontSize: 14,
    },
  },
};
