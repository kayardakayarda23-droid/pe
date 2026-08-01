export const colors = {
  // Brand Colors
  primary: "#10B981",
  primaryDark: "#059669",
  primaryLight: "#D1FAE5",

  secondary: "#3B82F6",

  // Status Colors
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",

  // Backgrounds
  background: "#F8FAFC",
  surface: "#FFFFFF",
  card: "#FFFFFF",

  // Basic Colors
  white: "#FFFFFF",
  black: "#000000",

  // Text
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textLight: "#9CA3AF",

  // Borders
  border: "#E5E7EB",

  // Finance
  income: "#16A34A",
  expense: "#DC2626",

  // States
  disabled: "#D1D5DB",
  disabledText: "#9CA3AF",

  // Shadow
  shadow: "#000000",

  // Gradient
  gradient: ["#10B981", "#059669"],
};

export const spacing = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
};

export const typography = {
  h1: {
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 38,
  },

  h2: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },

  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },

  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },

  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },

  caption: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  },

  button: {
    fontSize: 16,
    fontWeight: "600",
  },
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },

  button: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  small: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const categoryColors = {
  "Food & Dining": "#F97316",
  Transportation: "#3B82F6",
  Shopping: "#A855F7",
  Rent: "#EF4444",
  Utilities: "#14B8A6",
  Healthcare: "#EC4899",
  Education: "#6366F1",
  Entertainment: "#F59E0B",
  Travel: "#06B6D4",
  Insurance: "#64748B",
  Subscriptions: "#8B5CF6",
  Gifts: "#FB7185",
  Salary: "#22C55E",
  Investment: "#0EA5E9",
  Business: "#8B5CF6",
  Freelance: "#F97316",
  Savings: "#14B8A6",
  Miscellaneous: "#94A3B8",
};

export const layout = {
  screenPadding: spacing.lg,
  cardRadius: radius.lg,
  buttonHeight: 54,
  inputHeight: 54,
  headerHeight: 64,
};

export default {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  categoryColors,
  layout,
};