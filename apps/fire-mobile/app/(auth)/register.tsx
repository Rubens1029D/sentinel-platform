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
  validateName,
  validatePassword,
} from '@/utils/validation';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  const canSubmit =
    !nameError &&
    !emailError &&
    !passwordError;

  const handleNameChange = (value: string) => {
    const sanitizedValue = value.replace(/[^A-Za-z ]/g, '');
    setName(sanitizedValue);
  };

  const handleSubmit = () => {
    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!canSubmit) {
      return;
    }

    // En el siguiente incremento enviaremos estos datos a la API.
    console.log({
      name: name.trim(),
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

            <Text style={styles.title}>Crea tu cuenta</Text>

            <Text style={styles.subtitle}>
              Empecemos a preparar un plan adaptado a ti.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              autoCapitalize="words"
              error={nameTouched ? nameError : undefined}
              label="Nombre"
              onBlur={() => setNameTouched(true)}
              onChangeText={handleNameChange}
              placeholder="Tu nombre"
              value={name}
            />

            <TextField
              error={emailTouched ? emailError : undefined}
              keyboardType="email-address"
              label="Correo electrónico"
              onBlur={() => setEmailTouched(true)}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              value={email}
            />

            <TextField
              error={passwordTouched ? passwordError : undefined}
              label="Contraseña"
              onBlur={() => setPasswordTouched(true)}
            onChangeText={setPassword}
              placeholder="Mayúscula, minúscula y número"
              secureTextEntry
              value={password}
            />

            <Text style={styles.passwordHelp}>
              Mínimo 6 caracteres, una mayúscula, una minúscula y un número.
            </Text>

            <PrimaryButton
              disabled={!canSubmit}
              label="Crear cuenta"
              onPress={handleSubmit}
            />

            <Text
              accessibilityRole="link"
              onPress={() => router.back()}
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
