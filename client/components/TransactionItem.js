import React from "react";
import {
  View,
  Text,
 StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  colors,
  radius,
  spacing,
  typography,
  categoryColors,
  shadows,
} from "../utils/theme";
import {
  formatCurrency,
  formatShortDate,
} from "../utils/formatters";

export default function TransactionItem({
  item,
  type = "expense",
  onPress,
}) {
  const isIncome = type === "income";

  const title = isIncome ? item.source : item.title;

  const subtitle = isIncome
    ? formatShortDate(item.date)
    : `${item.category?.name || "General"} • ${formatShortDate(item.date)}`;

  const iconColor = isIncome
    ? colors.income
    : categoryColors[item.category?.name] || colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconColor + "20",
          },
        ]}
      >
        <MaterialCommunityIcons
          name={
            isIncome
              ? "cash-plus"
              : "cash-minus"
          }
          size={24}
          color={iconColor}
        />
      </View>

      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={styles.title}
        >
          {title}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      <Text
        style={[
          styles.amount,
          {
            color: isIncome
              ? colors.income
              : colors.expense,
          },
        ]}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.surface,

    padding: spacing.md,

    borderRadius: radius.md,

    marginBottom: spacing.sm,

    ...shadows.card,
  },

  iconContainer: {
    width: 52,
    height: 52,

    borderRadius: 26,

    justifyContent: "center",
    alignItems: "center",

    marginRight: spacing.md,
  },

  info: {
    flex: 1,
  },

  title: {
    ...typography.body,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  subtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 13,
  },

  amount: {
    fontSize: 17,
    fontWeight: "700",
  },
});