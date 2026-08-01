import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadows } from "../../utils/theme";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={styles.label}>Notifications</Text>
          </View>

          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons
              name="moon-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={styles.label}>Dark Mode</Text>
          </View>

          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.menu}>
          <Ionicons
            name="person-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={styles.menuText}>Account</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menu}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={styles.menuText}>Privacy</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menu}>
          <Ionicons
            name="help-circle-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menu}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={styles.menuText}>About</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    ...shadows.card,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    marginLeft: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  menu: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },

  menuText: {
    marginLeft: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
});