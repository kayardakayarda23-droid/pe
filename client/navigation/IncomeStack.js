import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IncomeListScreen from '../screens/income/IncomeListScreen';
import AddEditIncomeScreen from '../screens/income/AddEditIncomeScreen';
import { colors } from '../utils/theme';

const Stack = createNativeStackNavigator();

export default function IncomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.textPrimary, headerShadowVisible: false }}>
      <Stack.Screen name="IncomeList" component={IncomeListScreen} options={{ title: 'Income' }} />
      <Stack.Screen name="AddEditIncome" component={AddEditIncomeScreen} options={({ route }) => ({
        title: route.params?.income ? 'Edit Income' : 'Add Income',
      })} />
    </Stack.Navigator>
  );
}
