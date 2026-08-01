import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, BarChart, LineChart } from 'react-native-gifted-charts';

import { fetchAnalysis, fetchIncomeVsExpense } from '../../redux/slices/miscSlices';
import Card from '../../components/Card';
import { colors, categoryColors, spacing, typography } from '../../utils/theme';
import { formatCurrency } from '../../utils/formatters';

const PERIODS = [
  { key: 'daily', label: 'Day' },
  { key: 'weekly', label: 'Week' },
  { key: 'monthly', label: 'Month' },
  { key: 'quarterly', label: 'Quarter' },
  { key: 'yearly', label: 'Year' },
];

export default function AnalyticsScreen() {
  const dispatch = useDispatch();
  const { analysis, trend } = useSelector((state) => state.analytics);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    dispatch(fetchAnalysis(period));
  }, [dispatch, period]);

  useEffect(() => {
    dispatch(fetchIncomeVsExpense(6));
  }, [dispatch]);

  const pieData = (analysis?.categoryBreakdown || []).map((c) => ({
    value: c.amount,
    color: categoryColors[c.category] || colors.primary,
    text: c.category,
  }));

  const barData = (analysis?.timeline || []).slice(-10).map((t) => ({
    value: t.amount,
    label: t.date.slice(5),
    frontColor: colors.primary,
  }));

  const lineDataIncome = trend.map((m) => ({ value: m.income, label: m.month.slice(5) }));
  const lineDataExpense = trend.map((m) => ({ value: m.expense, label: m.month.slice(5) }));

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Analytics</Text>

      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.periodChip, period === p.key && styles.periodChipActive]}
            onPress={() => setPeriod(p.key)}
          >
            <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Total Spent</Text>
        <Text style={styles.bigNumber}>{formatCurrency(analysis?.totalExpenses)}</Text>
        <Text style={styles.metaText}>
          {analysis?.transactionCount || 0} transactions · avg {formatCurrency(analysis?.averagePerDay)}/day
        </Text>
      </Card>

      {pieData.length > 0 && (
        <Card style={{ marginBottom: spacing.md, alignItems: 'center' }}>
          <Text style={styles.cardTitle}>Expense Distribution</Text>
          <PieChart data={pieData} donut radius={90} innerRadius={55} textColor="#fff" />
          <View style={styles.legendWrap}>
            {pieData.map((d) => (
              <View key={d.text} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                <Text style={styles.legendText}>{d.text} ({formatCurrency(d.value)})</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {barData.length > 0 && (
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.cardTitle}>Spending Timeline</Text>
          <BarChart data={barData} barWidth={22} spacing={14} roundedTop noOfSections={4} yAxisTextStyle={{ color: colors.textSecondary }} xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }} />
        </Card>
      )}

      {trend.length > 0 && (
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.cardTitle}>Income vs Expense (6 months)</Text>
          <LineChart
            data={lineDataIncome}
            data2={lineDataExpense}
            color1={colors.income}
            color2={colors.expense}
            thickness={3}
            hideDataPoints={false}
            yAxisTextStyle={{ color: colors.textSecondary }}
            xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
            noOfSections={4}
          />
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
              <Text style={styles.legendText}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
              <Text style={styles.legendText}>Expense</Text>
            </View>
          </View>
        </Card>
      )}

      {analysis?.topExpenses?.length > 0 && (
        <Card>
          <Text style={styles.cardTitle}>Top Expenses</Text>
          {analysis.topExpenses.map((e) => (
            <View key={e.id} style={styles.topExpenseRow}>
              <Text style={styles.topExpenseTitle} numberOfLines={1}>{e.title}</Text>
              <Text style={styles.topExpenseAmount}>{formatCurrency(e.amount)}</Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },
  periodRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  periodChip: { flex: 1, paddingVertical: spacing.xs + 2, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  periodChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodText: { fontSize: 12, color: colors.textPrimary },
  periodTextActive: { color: '#fff', fontWeight: '600' },
  cardTitle: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', marginBottom: spacing.sm },
  bigNumber: { ...typography.h1, color: colors.textPrimary },
  metaText: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  legendWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md, justifyContent: 'center' },
  legendRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: colors.textSecondary },
  topExpenseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs + 2, borderBottomWidth: 1, borderBottomColor: colors.border },
  topExpenseTitle: { flex: 1, color: colors.textPrimary, marginRight: spacing.sm },
  topExpenseAmount: { color: colors.expense, fontWeight: '700' },
});
