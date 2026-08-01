import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { fetchBudgets } from "../../redux/slices/budgetSlice";
import Card from "../../components/Card";
import BudgetProgressBar from "../../components/BudgetProgressBar";
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
} from "../../utils/theme";
import { formatCurrency } from "../../utils/formatters";

export default function BudgetListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.budgets);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchBudgets());
    }, [dispatch])
  );

  const renderBudget = ({ item }) => {
    const spent = item.spent || item.totalSpent || 0;
    const remaining = Math.max(item.amount - spent, 0);

    const progress =
      item.amount > 0
        ? Math.min((spent / item.amount) * 100, 100)
        : 0;

    const progressColor =
      progress >= 90
        ? "#EF4444"
        : progress >= 70
        ? "#F59E0B"
        : "#22C55E";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("AddEditBudget", {
            budget: item,
          })
        }
      >
        <Card style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={24}
                color={progressColor}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {item.category?.name || "Overall Budget"}
              </Text>

              <Text style={styles.period}>
                {item.period.charAt(0) +
                  item.period.slice(1).toLowerCase()}
              </Text>
            </View>

            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>
                {Math.round(progress)}%
              </Text>
            </View>
          </View>

          <BudgetProgressBar budget={item} />

          <View style={styles.amountRow}>
            <View>
              <Text style={styles.label}>Budget</Text>
              <Text style={styles.amount}>
                {formatCurrency(item.amount)}
              </Text>
            </View>

            <View>
              <Text style={styles.label}>Remaining</Text>
              <Text
                style={[
                  styles.amount,
                  { color: progressColor },
                ]}
              >
                {formatCurrency(remaining)}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.flex}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderBudget}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          status === "succeeded" ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons
                name="wallet-plus-outline"
                size={70}
                color={colors.textSecondary}
              />

              <Text style={styles.emptyTitle}>
                No Budgets Yet
              </Text>

              <Text style={styles.emptySubtitle}>
                Create your first budget to start
                tracking your spending.
              </Text>
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("AddEditBudget")
        }
      >
        <Ionicons
          name="add"
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },

  list: {
    padding: spacing.lg,
    paddingBottom: 110,
  },

  card: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    ...shadows.card,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F4F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },

  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  period: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 13,
  },

  percentBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 30,
  },

  percentText: {
    color: colors.primary,
    fontWeight: "700",
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },

  label: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  amount: {
    marginTop: 4,
    fontWeight: "700",
    fontSize: 17,
    color: colors.textPrimary,
  },

  empty: {
    alignItems: "center",
    marginTop: 120,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  emptySubtitle: {
    marginTop: 10,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.card,
  },
});