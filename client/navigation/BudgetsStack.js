import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BudgetListScreen from '../screens/budgets/BudgetListScreen';
import AddEditBudgetScreen from '../screens/budgets/AddEditBudgetScreen';
import { colors } from '../utils/theme';

const Stack = createNativeStackNavigator();

export default function BudgetsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.textPrimary, headerShadowVisible: false }}>
      <Stack.Screen name="BudgetList" component={BudgetListScreen} options={{ title: 'Budgets' }} />
      <Stack.Screen name="AddEditBudget" component={AddEditBudgetScreen} options={({ route }) => ({
        title: route.params?.budget ? 'Edit Budget' : 'New Budget',
      })} />
    </Stack.Navigator>
  );
}
