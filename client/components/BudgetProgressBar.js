import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';

export default function BudgetProgressBar({ budget }) {
  const pct = Math.min(budget.percentage, 100);
  const barColor = budget.isOverBudget ? colors.danger : pct > 80 ? colors.warning : colors.secondary;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{budget.category?.name || 'Overall Budget'}</Text>
        <Text style={[styles.percentage, { color: barColor }]}>{budget.percentage}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.subtext}>{formatCurrency(budget.used)} used</Text>
        <Text style={styles.subtext}>
          {budget.isOverBudget ? 'Over by ' : ''}{formatCurrency(Math.abs(budget.remaining))}
          {budget.isOverBudget ? '' : ' left'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  label: { ...typography.body, fontWeight: '600', color: colors.textPrimary },
  percentage: { ...typography.body, fontWeight: '700' },
  track: { height: 10, backgroundColor: colors.border, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
  subtext: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
