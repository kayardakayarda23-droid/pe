import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import ExpensesStack from './ExpensesStack';
import IncomeStack from './IncomeStack';
import BudgetsStack from './BudgetsStack';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';
import ProfileStack from './ProfileStack';
import SettingsScreen from "../screens/settings/SettingsScreen";

import { colors } from '../utils/theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: 'home-outline',
  Expenses: 'card-outline',
  Income: 'cash-outline',
  Budgets: 'pie-chart-outline',
  Analytics: 'bar-chart-outline',
  Profile: 'person-circle-outline',
};

export default function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.08,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={ICONS[route.name]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="Expenses"
        component={ExpensesStack}
      />

      <Tab.Screen
        name="Income"
        component={IncomeStack}
      />

      <Tab.Screen
        name="Budgets"
        component={BudgetsStack}
      />

      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}