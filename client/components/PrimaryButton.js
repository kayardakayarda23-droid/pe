import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  colors,
  radius,
  spacing,
  typography,
  shadows,
} from '../utils/theme';

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  icon,
  variant = 'primary',
  style,
}) {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.filled,
        (disabled || loading) && styles.disabled,
        !isOutline && shadows.button,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={22}
              color={isOutline ? colors.primary : '#FFFFFF'}
              style={styles.icon}
            />
          )}

          <Text
            style={[
              styles.text,
              isOutline && styles.outlineText,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  filled: {
    backgroundColor: colors.primary,
  },

  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  disabled: {
    opacity: 0.6,
  },

  icon: {
    marginRight: 8,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  outlineText: {
    color: colors.primary,
  },
});