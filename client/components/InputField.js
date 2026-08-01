import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../utils/theme';

export default function InputField({
  label,
  error,
  icon,
  secureTextEntry,
  style,
  ...textInputProps
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <View style={[styles.wrapper, style]}>

      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.inputError,
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={isFocused ? colors.primary : colors.textSecondary}
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={hidePassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
          >
            <MaterialCommunityIcons
              name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },

  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 18,

    paddingHorizontal: spacing.md,
    minHeight: 58,
  },

  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: 14,
  },

  icon: {
    marginRight: 10,
  },

  inputError: {
    borderColor: colors.danger,
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});