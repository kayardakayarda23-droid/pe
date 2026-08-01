import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpenseListScreen from '../screens/expenses/ExpenseListScreen';
import AddEditExpenseScreen from '../screens/expenses/AddEditExpenseScreen';
import { colors } from '../utils/theme';

const Stack = createNativeStackNavigator();

export default function ExpensesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.textPrimary, headerShadowVisible: false }}>
      <Stack.Screen name="ExpenseList" component={ExpenseListScreen} options={{ title: 'Expenses' }} />
      <Stack.Screen name="AddEditExpense" component={AddEditExpenseScreen} options={({ route }) => ({
        title: route.params?.expense ? 'Edit Expense' : 'Add Expense',
      })} />
    </Stack.Navigator>
  );
}
