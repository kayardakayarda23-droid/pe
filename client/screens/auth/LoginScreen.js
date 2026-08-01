import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { login, clearAuthError } from "../../redux/slices/authSlice";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
} from "../../utils/theme";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const emailError =
    touched && !/^\S+@\S+\.\S+$/.test(email)
      ? "Enter a valid email"
      : null;

  const passwordError =
    touched && password.length < 1
      ? "Password is required"
      : null;

  const handleLogin = () => {
    setTouched(true);
    dispatch(clearAuthError());

    if (!emailError && !passwordError && email && password) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>

          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="wallet-outline"
              size={42}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.title}>
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            Sign in to continue managing your finances.
          </Text>

        </View>

        {/* Login Card */}

        <View style={styles.card}>

          <InputField
            label="Email"
            icon="email-outline"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={emailError}
          />

          <InputField
            label="Password"
            icon="lock-outline"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={passwordError}
          />

          {error ? (
            <Text style={styles.serverError}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ForgotPassword")
            }
          >
            <Text style={styles.forgot}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Sign In"
            icon="login"
            onPress={handleLogin}
            loading={status === "loading"}
            style={{ marginTop: spacing.md }}
          />

        </View>

        {/* Footer */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Register")
            }
          >
            <Text style={styles.register}>
              Create Account
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    ...shadows.button,
  },

  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: "center",
  },

  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },

  forgot: {
    color: colors.primary,
    textAlign: "right",
    fontWeight: "600",
    marginTop: 6,
  },

  serverError: {
    color: colors.danger,
    textAlign: "center",
    marginTop: 8,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },

  footerText: {
    color: colors.textSecondary,
  },

  register: {
    color: colors.primary,
    fontWeight: "700",
    marginLeft: 5,
  },
});