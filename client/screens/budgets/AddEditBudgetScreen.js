import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { addBudget, editBudget, removeBudget } from '../../redux/slices/budgetSlice';
import { fetchCategories } from '../../redux/slices/miscSlices';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius, spacing, typography } from '../../utils/theme';
import { toISODateOnly } from '../../utils/formatters';

const PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY'];

function defaultEndDate(period, start) {
  const d = new Date(start);
  if (period === 'DAILY') return toISODateOnly(d);
  if (period === 'WEEKLY') { d.setDate(d.getDate() + 6); return toISODateOnly(d); }
  d.setMonth(d.getMonth() + 1); d.setDate(d.getDate() - 1);
  return toISODateOnly(d);
}

export default function AddEditBudgetScreen({ route, navigation }) {
  const existing = route.params?.budget;
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);

  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [period, setPeriod] = useState(existing?.period || 'MONTHLY');
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? null);
  const [startDate, setStartDate] = useState(existing ? toISODateOnly(existing.startDate) : toISODateOnly(new Date()));
  const [endDate, setEndDate] = useState(existing ? toISODateOnly(existing.endDate) : defaultEndDate('MONTHLY', new Date()));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handlePeriodChange = (p) => {
    setPeriod(p);
    setEndDate(defaultEndDate(p, startDate));
  };

  const handleSave = async () => {
    setError(null);
    if (!amount || !startDate || !endDate) {
      setError('Amount, start date, and end date are required');
      return;
    }
    setSaving(true);
    const payload = { amount: Number(amount), period, categoryId, startDate, endDate };
    try {
      if (existing) {
        await dispatch(editBudget({ id: existing.id, data: payload })).unwrap();
      } else {
        await dispatch(addBudget(payload)).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete budget', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await dispatch(removeBudget(existing.id));
          navigation.goBack();
        },
      },
    ]);
  };

 return (
  <ScrollView
    style={styles.flex}
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
  >
    {/* Header Card */}
    <View style={styles.headerCard}>
      <Text style={styles.headerTitle}>
        {existing ? "Edit Budget" : "Create Budget"}
      </Text>

      <Text style={styles.headerSubtitle}>
        Set a spending limit and stay in control of your finances.
      </Text>
    </View>

    {/* Amount */}
    <View style={styles.section}>
      <Text style={styles.label}>Budget Amount</Text>

      <InputField
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />
    </View>

    {/* Period */}
    <View style={styles.section}>
      <Text style={styles.label}>Budget Period</Text>

      <View style={styles.chipRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.chip,
              period === p && styles.activeChip,
            ]}
            onPress={() => handlePeriodChange(p)}
          >
            <Text
              style={[
                styles.chipText,
                period === p && styles.activeChipText,
              ]}
            >
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    {/* Categories */}
    <View style={styles.section}>
      <Text style={styles.label}>Category</Text>

      <View style={styles.chipRow}>
        <TouchableOpacity
          style={[
            styles.chip,
            categoryId === null && styles.activeChip,
          ]}
          onPress={() => setCategoryId(null)}
        >
          <Text
            style={[
              styles.chipText,
              categoryId === null &&
                styles.activeChipText,
            ]}
          >
            Overall
          </Text>
        </TouchableOpacity>

        {categories
          .filter((c) => c.type === "EXPENSE")
          .map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                categoryId === cat.id &&
                  styles.activeChip,
              ]}
              onPress={() => setCategoryId(cat.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  categoryId === cat.id &&
                    styles.activeChipText,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>

    {/* Dates */}
    <View style={styles.section}>
      <Text style={styles.label}>Start Date</Text>

      <InputField
        value={startDate}
        onChangeText={setStartDate}
        placeholder="YYYY-MM-DD"
      />
    </View>

    <View style={styles.section}>
      <Text style={styles.label}>End Date</Text>

      <InputField
        value={endDate}
        onChangeText={setEndDate}
        placeholder="YYYY-MM-DD"
      />
    </View>

    {/* Preview Card */}
    <View style={styles.previewCard}>
      <Text style={styles.previewTitle}>
        Budget Preview
      </Text>

      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>
          Amount
        </Text>

        <Text style={styles.previewValue}>
          ₦{amount || "0.00"}
        </Text>
      </View>

      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>
          Period
        </Text>

        <Text style={styles.previewValue}>
          {period}
        </Text>
      </View>

      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>
          Duration
        </Text>

        <Text style={styles.previewValue}>
          {startDate} → {endDate}
        </Text>
      </View>
    </View>

    {error ? (
      <Text style={styles.error}>{error}</Text>
    ) : null}

    <PrimaryButton
      title={
        existing
          ? "Save Changes"
          : "Create Budget"
      }
      onPress={handleSave}
      loading={saving}
      style={styles.saveButton}
    />

    {existing && (
      <PrimaryButton
        title="Delete Budget"
        variant="outline"
        onPress={handleDelete}
        style={styles.deleteButton}
      />
    )}
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
    paddingBottom: spacing.xl,
  },

  headerCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },

  headerTitle: {
    ...typography.h2,
    color: "#fff",
    fontWeight: "700",
  },

  headerSubtitle: {
    marginTop: spacing.xs,
    color: "#EAF4FF",
    lineHeight: 22,
  },

  section: {
    marginBottom: spacing.lg,
  },

  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  chipText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },

  activeChipText: {
    color: "#fff",
    fontWeight: "700",
  },

  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  previewTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },

  previewLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  previewValue: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
  },

  error: {
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.md,
    fontWeight: "600",
  },

  saveButton: {
    marginTop: spacing.md,
  },

  deleteButton: {
    marginTop: spacing.md,
    borderColor: colors.danger,
  },
});