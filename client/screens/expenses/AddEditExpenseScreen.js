import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

import { addExpense, editExpense, removeExpense } from '../../redux/slices/expenseSlice';
import { fetchCategories } from '../../redux/slices/miscSlices';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius, spacing, typography } from '../../utils/theme';
import { toISODateOnly } from '../../utils/formatters';

const PAYMENT_METHODS = ['CASH', 'CARD', 'BANK_TRANSFER', 'UPI', 'WALLET', 'OTHER'];

export default function AddEditExpenseScreen({ route, navigation }) {
  const existing = route.params?.expense;
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);

  const [title, setTitle] = useState(existing?.title || '');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [categoryId, setCategoryId] = useState(existing?.categoryId || null);
  const [date, setDate] = useState(existing ? toISODateOnly(existing.date) : toISODateOnly(new Date()));
  const [paymentMethod, setPaymentMethod] = useState(existing?.paymentMethod || 'CASH');
  const [merchantName, setMerchantName] = useState(existing?.merchantName || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [receipt, setReceipt] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  const pickReceipt = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to attach a receipt.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setReceipt({ uri: asset.uri, name: asset.fileName || 'receipt.jpg', type: 'image/jpeg' });
    }
  };

  const handleSave = async () => {
    setError(null);
    if (!title.trim() || !amount || !categoryId || !date) {
      setError('Title, amount, category, and date are required');
      return;
    }
    setSaving(true);
    const payload = { title, amount: Number(amount), categoryId, date, paymentMethod, merchantName, notes, receipt };
    try {
      if (existing) {
        await dispatch(editExpense({ id: existing.id, data: payload })).unwrap();
      } else {
        await dispatch(addExpense(payload)).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete expense', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await dispatch(removeExpense(existing.id));
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <InputField label="Title" placeholder="e.g. Grocery run" value={title} onChangeText={setTitle} />
      <InputField label="Amount" placeholder="0.00" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
      <InputField label="Date (YYYY-MM-DD)" placeholder="2026-07-18" value={date} onChangeText={setDate} />
      <InputField label="Merchant (optional)" placeholder="e.g. Whole Foods" value={merchantName} onChangeText={setMerchantName} />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {expenseCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, categoryId === cat.id && styles.chipActive]}
            onPress={() => setCategoryId(cat.id)}
          >
            <Text style={[styles.chipText, categoryId === cat.id && styles.chipTextActive]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.chipRow}>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method}
            style={[styles.chip, paymentMethod === method && styles.chipActive]}
            onPress={() => setPaymentMethod(method)}
          >
            <Text style={[styles.chipText, paymentMethod === method && styles.chipTextActive]}>
              {method.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <InputField label="Notes (optional)" placeholder="Any details" value={notes} onChangeText={setNotes} multiline />

      <Text style={styles.label}>Receipt</Text>
      <TouchableOpacity style={styles.receiptBox} onPress={pickReceipt}>
        {receipt ? (
          <Image source={{ uri: receipt.uri }} style={styles.receiptImage} />
        ) : (
          <Text style={styles.receiptText}>Tap to attach a receipt photo</Text>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton title={existing ? 'Save Changes' : 'Add Expense'} onPress={handleSave} loading={saving} style={{ marginTop: spacing.lg }} />
      {existing ? (
        <PrimaryButton title="Delete Expense" onPress={handleDelete} variant="outline" style={{ marginTop: spacing.sm, borderColor: colors.danger }} />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  label: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', marginBottom: spacing.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textPrimary, fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  receiptBox: {
    height: 140,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  receiptImage: { width: '100%', height: '100%' },
  receiptText: { color: colors.textSecondary },
  error: { color: colors.danger, marginTop: spacing.sm, textAlign: 'center' },
});
