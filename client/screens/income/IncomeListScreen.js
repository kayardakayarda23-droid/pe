import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addIncome, editIncome, removeIncome } from '../../redux/slices/incomeSlice';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing } from '../../utils/theme';
import { toISODateOnly } from '../../utils/formatters';

export default function AddEditIncomeScreen({ route, navigation }) {
  const existing = route.params?.income;
  const dispatch = useDispatch();
  const [source, setSource] = useState(existing?.source || '');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [date, setDate] = useState(existing ? toISODateOnly(existing.date) : toISODateOnly(new Date()));
  const [notes, setNotes] = useState(existing?.notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setError(null);
    if (
      !source.trim() ||
      !amount ||
      Number(amount) <= 0 ||
      !date
    ) {
      setError("Enter a valid income source, amount and date.");
      return;
    }
    setSaving(true);
    const payload = { source, amount: Number(amount), date, notes };
    try {
      if (existing) {
        await dispatch(editIncome({ id: existing.id, data: payload })).unwrap();
      } else {
        await dispatch(addIncome(payload)).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to save income');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete income', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await dispatch(removeIncome(existing.id));
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
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>
          {existing ? "Edit Income" : "Add Income"}
        </Text>
        <Text style={styles.headerSubtitle}>
          Record your income and keep your finances up to date.
        </Text>
      </View>

      {/* Source */}
      <View style={styles.section}>
        <Text style={styles.label}>Income Source</Text>
        <InputField
          placeholder="Salary, Freelance..."
          value={source}
          onChangeText={setSource}
        />
      </View>

      {/* Amount */}
      <View style={styles.section}>
        <Text style={styles.label}>Amount</Text>
        <InputField
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <InputField
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.label}>Notes</Text>
        <InputField
          placeholder="Optional notes"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* Preview */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>
          Income Preview
        </Text>
        <View style={styles.previewRow}>
          <Text style={styles.previewLabel}>Source</Text>
          <Text style={styles.previewValue}>
            {source || "-"}
          </Text>
        </View>
        <View style={styles.previewRow}>
          <Text style={styles.previewLabel}>Amount</Text>
          <Text
            style={[
              styles.previewValue,
              { color: colors.success },
            ]}
          >
            {amount
              ? `₦${Number(amount).toLocaleString()}`
              : "₦0.00"}
          </Text>
        </View>
        <View style={styles.previewRow}>
          <Text style={styles.previewLabel}>Date</Text>
          <Text style={styles.previewValue}>
            {date}
          </Text>
        </View>
      </View>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <PrimaryButton
        title={existing ? "Save Changes" : "Add Income"}
        onPress={handleSave}
        loading={saving}
        style={styles.saveButton}
      />
      {existing && (
        <PrimaryButton
          title="Delete Income"
          variant="outline"
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },

  headerCard: {
    backgroundColor: colors.success,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  headerSubtitle: {
    color: "#EAFBF0",
    marginTop: 6,
    lineHeight: 22,
  },

  section: {
    marginBottom: spacing.lg,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  previewTitle: {
    fontSize: 18,
    fontWeight: "700",
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
  },

  previewValue: {
    color: colors.textPrimary,
    fontWeight: "700",
  },

  saveButton: {
    marginTop: spacing.md,
  },

  deleteButton: {
    marginTop: spacing.md,
    borderColor: colors.danger,
  },

  error: {
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.md,
    fontWeight: "600",
  },
});