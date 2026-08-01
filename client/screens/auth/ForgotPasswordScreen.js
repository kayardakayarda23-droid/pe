import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { authService } from '../../services/authService';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, typography } from '../../utils/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.subtitle}>Enter your email and we'll send you a reset link</Text>

      <InputField
        label="Email"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <PrimaryButton title="Send reset link" onPress={handleSubmit} loading={loading} />

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: spacing.lg, alignSelf: 'center' }}>
        <Text style={styles.link}>Back to login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  message: { color: colors.textPrimary, marginBottom: spacing.md, textAlign: 'center' },
  link: { color: colors.primary, fontWeight: '600' },
});
