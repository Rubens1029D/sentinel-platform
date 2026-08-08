import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import { ApiError } from '@/services/api/api-client';
import { register } from '@/stores/auth-store';
import { colors } from '@/theme/colors';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '@/utils/validation';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameTouched, setNameTouched] =
    useState(false);

  const [emailTouched, setEmailTouched] =
    useState(false);

  const [
    passwordTouched,
    setPasswordTouched,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError =
    validatePassword(password);

  const canSubmit =
    !nameError &&
    !emailError &&
    !passwordError &&
    !isSubmitting;

  const handleNameChange = (
    value: string,
  ) => {
    const sanitizedValue =
      value.replace(
        /[^A-Za-z ]/g,
        '',
      );

    setName(sanitizedValue);
  };

  const handleSubmit = async () => {
    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email
          .trim()
          .toLowerCase(),
        password,
      });

      router.replace('/profile');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          Alert.alert(
            'Cuenta existente',
            'Ya existe una cuenta registrada con este correo electrónico.',
          );

          return;
        }

        if (error.status === 400) {
          Alert.alert(
            'Datos inválidos',
            error.message,
          );

          return;
        }

        if (error.status === 429) {
          Alert.alert(
            'Demasiados intentos',
            'Espera un momento antes de volver a intentar.',
          );

          return;
        }

        Alert.alert(
          'Error',
          error.message,
        );

        return;
      }

      Alert.alert(
        'Sin conexión',
        'No fue posible conectar con Sentinel. Verifica que el servidor esté disponible.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={
            styles.container
          }
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <BrandHeader compact />

            <Text style={styles.title}>
              Crea tu cuenta
            </Text>

            <Text style={styles.subtitle}>
              Empecemos a preparar un plan
              adaptado a ti.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              autoCapitalize="words"
              error={
                nameTouched ||
                name.length > 0
                  ? nameError
                  : undefined
              }
              label="Nombre"
              onBlur={() =>
                setNameTouched(true)
              }
              onChangeText={
                handleNameChange
              }
              placeholder="Tu nombre"
              value={name}
            />

            <TextField
              error={
                emailTouched ||
                email.length > 0
                  ? emailError
                  : undefined
              }
              keyboardType="email-address"
              label="Correo electrónico"
              onBlur={() =>
                setEmailTouched(true)
              }
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              value={email}
            />

            <TextField
              error={
                passwordTouched ||
                password.length > 0
                  ? passwordError
                  : undefined
              }
              label="Contraseña"
              onBlur={() =>
                setPasswordTouched(true)
              }
              onChangeText={setPassword}
              placeholder="Mayúscula, minúscula y número"
              secureTextEntry
              value={password}
            />

            <Text style={styles.passwordHelp}>
              Mínimo 8 caracteres, una
              mayúscula, una minúscula y un
              número.
            </Text>

            <PrimaryButton
              disabled={!canSubmit}
              label={
                isSubmitting
                  ? 'Creando cuenta...'
                  : 'Crear cuenta'
              }
              onPress={() => {
                void handleSubmit();
              }}
            />

            <Text
              accessibilityRole="link"
              onPress={() =>
                router.back()
              }
              style={styles.link}
            >
              Ya tengo cuenta
            </Text>
          </View>
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
  passwordHelp: {
    marginTop: -8,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  link: {
    color: colors.brandCyan,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});