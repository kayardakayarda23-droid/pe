import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { reportService } from '../../services/resourceServices';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius, spacing, typography } from '../../utils/theme';

const REPORT_TYPES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'yearly', label: 'Yearly' },
  { key: 'budget', label: 'Budget' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
];

const FORMATS = [
  { key: 'pdf', label: 'PDF', ext: 'pdf' },
  { key: 'excel', label: 'Excel', ext: 'xlsx' },
  { key: 'csv', label: 'CSV', ext: 'csv' },
];

export default function ReportsScreen() {
  const [type, setType] = useState('monthly');
  const [format, setFormat] = useState('pdf');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const url = reportService.downloadUrl(type, format);
      const ext = FORMATS.find((f) => f.key === format).ext;
      const fileUri = `${FileSystem.documentDirectory}${type}-report.${ext}`;

      const result = await FileSystem.downloadAsync(url, fileUri, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (result.status !== 200) {
        throw new Error('Report generation failed');
      }

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(result.uri);
      } else {
        Alert.alert('Report saved', `Saved to ${result.uri}`);
      }
    } catch (err) {
      Alert.alert('Download failed', err.message || 'Could not generate the report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.subtitle}>Generate and export a financial report</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.label}>Report Type</Text>
        <View style={styles.chipRow}>
          {REPORT_TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.chip, type === t.key && styles.chipActive]}
              onPress={() => setType(t.key)}
            >
              <Text style={[styles.chipText, type === t.key && styles.chipTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>Format</Text>
        <View style={styles.chipRow}>
          {FORMATS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, format === f.key && styles.chipActive]}
              onPress={() => setFormat(f.key)}
            >
              <Text style={[styles.chipText, format === f.key && styles.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton
          title={downloading ? 'Generating…' : 'Download Report'}
          onPress={handleDownload}
          loading={downloading}
          style={{ marginTop: spacing.lg }}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  label: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', marginBottom: spacing.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
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
});
