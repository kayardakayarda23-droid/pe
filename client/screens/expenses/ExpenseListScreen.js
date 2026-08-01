import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { fetchExpenses, removeExpense } from '../../redux/slices/expenseSlice';
import TransactionItem from '../../components/TransactionItem';
import InputField from '../../components/InputField';
import { colors, spacing, typography } from '../../utils/theme';

export default function ExpenseListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.expenses);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchExpenses({ q: search || undefined }));
    }, [dispatch, search])
  );

  const handleDelete = (expense) => {
    Alert.alert('Delete expense', `Remove "${expense.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(removeExpense(expense.id)) },
    ]);
  };

  return (
    <View style={styles.flex}>
      <View style={styles.searchWrap}>
        <InputField placeholder="Search expenses..." value={search} onChangeText={setSearch} style={{ marginBottom: 0 }} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleDelete(item)}
            onPress={() => navigation.navigate('AddEditExpense', { expense: item })}
          >
            <TransactionItem item={item} type="expense" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          status === 'succeeded' ? (
            <Text style={styles.emptyText}>No expenses found. Tap + to add one.</Text>
          ) : null
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEditExpense')} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl, ...typography.body },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
