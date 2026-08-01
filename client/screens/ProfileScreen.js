import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
} from "../utils/theme";

import { formatCurrency } from "../utils/formatters";

export default function ProfileScreen({ navigation }) {
  const incomes = useSelector((state) => state.incomes.items);
  const expenses = useSelector((state) => state.expenses.items);

  const totalIncome = incomes.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const balance = totalIncome - totalExpense;

  const MenuItem = ({ icon, title, color = colors.primary, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <Text style={styles.menuTitle}>{title}</Text>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textLight}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={55}
            color={colors.primary}
          />
        </View>

        <Text style={styles.name}>
          Personal Finance
        </Text>

        <Text style={styles.email}>
          Manage your money smarter
        </Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          Financial Summary
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Ionicons
              name="wallet"
              size={26}
              color={colors.primary}
            />

            <Text style={styles.summaryLabel}>
              Balance
            </Text>

            <Text style={styles.summaryValue}>
              {formatCurrency(balance)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons
              name="arrow-down-circle"
              size={26}
              color={colors.success}
            />

            <Text style={styles.summaryLabel}>
              Income
            </Text>

            <Text
              style={[
                styles.summaryValue,
                { color: colors.success },
              ]}
            >
              {formatCurrency(totalIncome)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons
              name="arrow-up-circle"
              size={26}
              color={colors.danger}
            />

            <Text style={styles.summaryLabel}>
              Expense
            </Text>

            <Text
              style={[
                styles.summaryValue,
                { color: colors.danger },
              ]}
            >
              {formatCurrency(totalExpense)}
            </Text>
          </View>
        </View>
      </View>

      {/* Settings */}
<View style={styles.menuCard}>
  <Text style={styles.sectionTitle}>Settings</Text>

  <MenuItem
  icon="person-outline"
  title="Edit Profile"
  onPress={() => navigation.navigate("Settings")}
/>

<MenuItem
  icon="grid-outline"
  title="Manage Categories"
  onPress={() => navigation.navigate("Settings")}
/>

<MenuItem
  icon="download-outline"
  title="Export Data"
  onPress={() => navigation.navigate("Settings")}
/>

<MenuItem
  icon="cloud-upload-outline"
  title="Backup & Restore"
  onPress={() => navigation.navigate("Settings")}
/>

<MenuItem
  icon="notifications-outline"
  title="Notifications"
  onPress={() => navigation.navigate("Settings")}
/>

<MenuItem
  icon="moon-outline"
  title="Dark Mode"
  onPress={() => navigation.navigate("Settings")}
/>

<MenuItem
  icon="information-circle-outline"
  title="About"
  onPress={() => navigation.navigate("Settings")}
/>
</View>

      {/* Logout */}
<TouchableOpacity
  style={styles.logoutButton}
  onPress={() => navigation.replace("Login")}
>
  <Ionicons
    name="log-out-outline"
    size={22}
    color="#fff"
  />

  <Text style={styles.logoutText}>
    Logout
  </Text>
</TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  headerCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadows.card,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  name: {
    ...typography.h2,
    color: "#fff",
  },

  email: {
    color: "#E8FFF5",
    marginTop: 6,
  },

  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },

  summaryTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryItem: {
    alignItems: "center",
    flex: 1,
  },

  summaryLabel: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 13,
  },

  summaryValue: {
    marginTop: 6,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },

  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.card,
  },

  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  menuTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },

  logoutButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.danger,
    borderRadius: radius.lg,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.button,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 16,
  },
});