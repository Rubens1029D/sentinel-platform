import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BrandHeader } from '@/components/ui/BrandHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/theme/colors';
import {
  validateEmail,
  validatePassword,
} from '@/utils/validation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  const canSubmit = !emailError && !passwordError;

  const handleSubmit = () => {
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!canSubmit) {
      return;
    }

    // La integración con la API se realizará en el siguiente incremento.
    console.log({
      email: email.trim().toLowerCase(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <BrandHeader compact />

            <Text style={styles.title}>Bienvenido de nuevo</Text>

            <Text style={styles.subtitle}>
              Inicia sesión para continuar con tu preparación.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
            error={
              emailTouched || email.length > 0
                ? emailError
                : undefined
            }
              keyboardType="email-address"
              label="Correo electrónico"
            lur={() => setEmailTouched(true)}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              value={email}
            />

            <TextField
              error={
                passwordTouched || password.length > 0
                  ? passwordError
                  : undefined
              }
              label="Contraseña"
              onBlur={() => setPasswordTouched(true)}
              onChangeText={setPassword}
              placeholder="Mayúscula, minúscula y número"
              secureTextEntry
              value={password}
            />

            <PrimaryButton
              disabled={!canSubmit}
              label="Iniciar sesión"
              onPress={handleSubmit}
            />

            <Text
              accessibilityRole="link"
              onPress={() => router.push('/register')}
              style={styles.link}
            >
              ¿Aún no tienes cuenta? Crear cuenta
            </Text>
          </View>

          <Text
            accessibilityRole="link"
            onPress={() => router.replace('/')}
     style={styles.back}
          >
            Volver
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 48,
  },
  header: {
    gap: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 18,
    lineHeight: 27,
  },
  form: {
    gap: 18,
  },
  link: {
    color: colors.brandCyan,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  back: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
