import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../redux/slices/authSlice';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, typography } from '../../utils/theme';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);

  const nameError = touched && !name.trim() ? 'Name is required' : null;
  const emailError = touched && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email' : null;
  const passwordError = touched && password.length < 8 ? 'Password must be at least 8 characters' : null;

  const handleRegister = () => {
    setTouched(true);
    dispatch(clearAuthError());
    if (!nameError && !emailError && !passwordError && name && email && password) {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start tracking your money in minutes</Text>

        <InputField label="Full name" placeholder="Jane Doe" value={name} onChangeText={setName} error={nameError} />
        <InputField
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={emailError}
        />
        <InputField
          label="Password"
          placeholder="At least 8 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={passwordError}
        />

        {error ? <Text style={styles.serverError}>{error}</Text> : null}

        <PrimaryButton title="Sign Up" onPress={handleRegister} loading={status === 'loading'} style={{ marginTop: spacing.sm }} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  serverError: { color: colors.danger, marginBottom: spacing.sm, textAlign: 'center' },
  link: { color: colors.primary, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textSecondary },
});
