import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { notificationService } from '../services/resourceServices';
import { colors, spacing, typography } from '../utils/theme';
import { formatDate } from '../utils/formatters';

const ICONS = {
  DAILY_REMINDER: 'time-outline',
  BUDGET_EXCEEDED: 'alert-circle-outline',
  WEEKLY_REPORT: 'document-text-outline',
  MONTHLY_REPORT: 'document-text-outline',
  SAVINGS_REMINDER: 'wallet-outline',
  BILL_DUE: 'calendar-outline',
};

export default function NotificationsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await notificationService.list();
      setItems(res.data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handlePress = async (item) => {
    if (!item.isRead) {
      await notificationService.markRead(item.id);
      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)));
    }
  };

  const handleMarkAll = async () => {
    await notificationService.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAll}>
          <Text style={styles.markAll}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.row, !item.isRead && styles.unreadRow]} onPress={() => handlePress(item)}>
            <Ionicons name={ICONS[item.type] || 'notifications-outline'} size={22} color={colors.primary} style={{ marginRight: spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowMessage}>{item.message}</Text>
              <Text style={styles.rowDate}>{formatDate(item.createdAt)}</Text>
            </View>
            {!item.isRead && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>You're all caught up.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, paddingBottom: spacing.sm },
  title: { ...typography.h2, color: colors.textPrimary },
  markAll: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.sm + 2, borderBottomWidth: 1, borderBottomColor: colors.border },
  unreadRow: { backgroundColor: '#EAF4FD' },
  rowTitle: { ...typography.body, fontWeight: '600', color: colors.textPrimary },
  rowMessage: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  rowDate: { ...typography.caption, color: colors.textSecondary, marginTop: 4, fontSize: 11 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
