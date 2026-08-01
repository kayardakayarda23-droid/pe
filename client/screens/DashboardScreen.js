import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchDashboard } from '../redux/slices/miscSlices';
import { usePushNotifications } from '../hooks/usePushNotifications';
import Card from '../components/Card';
import TransactionItem from '../components/TransactionItem';
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
} from '../utils/theme';
import { formatCurrency } from '../utils/formatters';

export default function DashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.dashboard);
  const user = useSelector((state) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);

  usePushNotifications();

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDashboard());
    }, [dispatch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDashboard());
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.greeting}>Hi{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</Text>
      <Text style={styles.subGreeting}>Here's your financial snapshot</Text>

      <View style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <View>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(data?.currentBalance)}
            </Text>
          </View>

          <MaterialCommunityIcons
            name="wallet"
            size={34}
            color="white"
          />
        </View>

        <View style={styles.balanceRow}>
          <View>
            <Text style={styles.balanceSubLabel}>Income</Text>
            <Text
              style={[
                styles.balanceSubAmount,
                { color: "#D1FAE5" },
              ]}
            >
              {formatCurrency(data?.totalIncome)}
            </Text>
          </View>

          <View>
            <Text style={styles.balanceSubLabel}>Expenses</Text>
            <Text
              style={[
                styles.balanceSubAmount,
                { color: "#FECACA" },
              ]}
            >
              {formatCurrency(data?.totalExpenses)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Expenses")}
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="cash-minus"
              size={24}
              color={colors.primary}
            />
          </View>
          <Text style={styles.actionText}>Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Income")}
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="cash-plus"
              size={24}
              color={colors.success}
            />
          </View>
          <Text style={styles.actionText}>Income</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Analytics")}
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color="#6366F1"
            />
          </View>
          <Text style={styles.actionText}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Budgets")}
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="wallet-outline"
              size={24}
              color="#F59E0B"
            />
          </View>
          <Text style={styles.actionText}>Budget</Text>
        </TouchableOpacity>
      </View>

      {data?.monthlyBudget > 0 && (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.cardTitle}>Monthly Budget</Text>
          <Text style={styles.cardBig}>{formatCurrency(data.budgetRemaining)} <Text style={styles.cardBigSub}>remaining</Text></Text>
          <Text style={styles.cardMeta}>{data.budgetUsedPercentage}% of {formatCurrency(data.monthlyBudget)} used</Text>
        </Card>
      )}

      <View style={styles.statRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Transactions</Text>
          <Text style={styles.statValue}>{data?.totalTransactions ?? 0}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Largest Expense</Text>
          <Text style={styles.statValue}>{formatCurrency(data?.largestExpense?.amount)}</Text>
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <Card>
        {status === 'succeeded' && (!data?.recentTransactions || data.recentTransactions.length === 0) ? (
          <Text style={styles.emptyText}>No transactions yet — add your first expense!</Text>
        ) : (
          data?.recentTransactions?.map((item) => (
            <TransactionItem key={item.id} item={item} type="expense" />
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  greeting: { ...typography.h2, color: colors.textPrimary },
  subGreeting: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  balanceCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  balanceLabel: { color: '#D6E9FB', ...typography.caption },
  balanceAmount: { color: '#fff', fontSize: 34, fontWeight: '800', marginVertical: spacing.xs },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  balanceSubLabel: { color: '#D6E9FB', fontSize: 12 },
  balanceSubAmount: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  cardTitle: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  cardBig: { ...typography.h2, color: colors.textPrimary, marginTop: 4 },
  cardBigSub: { ...typography.caption, color: colors.textSecondary, fontWeight: '400' },
  cardMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  statRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  statCard: { flex: 1 },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  statValue: { ...typography.h3, color: colors.textPrimary, marginTop: 4 },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  emptyText: { color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.md },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  actionButton: {
    width: 82,
    height: 92,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.card,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: "600",
  },
});