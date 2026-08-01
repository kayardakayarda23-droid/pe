import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from '../services/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Registers the device for push notifications and sends the token to the
// backend so it can target this device via Firebase Cloud Messaging.
// Call this once from a top-level authenticated screen (e.g. Dashboard).
export function usePushNotifications() {
  useEffect(() => {
    async function register() {
      if (!Device.isDevice) return; // push tokens require a physical device / valid emulator config

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      try {
        const tokenResponse = await Notifications.getDevicePushTokenAsync();
        await api.post('/notifications/register-device', { deviceToken: tokenResponse.data });
      } catch (err) {
        console.warn('Failed to register push token:', err.message);
      }
    }

    register();
  }, []);
}
