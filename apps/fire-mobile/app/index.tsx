import { router } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BrandHeader } from '@/components/ui/BrandHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import {
  logout,
  useAuthStore,
} from '@/stores/auth-store';
import { colors } from '@/theme/colors';

export default function WelcomeScreen() {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  if (user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <BrandHeader />

          <View style={styles.content}>
            <Text style={styles.eyebrow}>
              SESIÓN ACTIVA
            </Text>

            <Text style={styles.title}>
              Hola, {user.name}
            </Text>

            <Text style={styles.subtitle}>
              Tu sesión se restauró correctamente.
            </Text>

            <Text style={styles.description}>
              {user.email}
            </Text>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label="Continuar"
              onPress={() =>
                router.push('/profile')
              }
            />

            <Text
              accessibilityRole="button"
              onPress={() => {
                void handleLogout();
              }}
              style={styles.logout}
            >
              Cerrar sesión
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BrandHeader />

        <View style={styles.content}>
          <Text style={styles.eyebrow}>
            PREPARACIÓN OPERATIVA
          </Text>

          <Text style={styles.title}>
            Entrena para salvar vidas.
          </Text>

          <Text style={styles.subtitle}>
            Nosotros nos encargamos del resto.
          </Text>

          <Text style={styles.description}>
            Tu entrenamiento se adapta cada día
            a tu recuperación, experiencia,
            tiempo disponible y equipo.
          </Text>

          <View style={styles.featureRow}>
            <View style={styles.featureDot} />

            <Text style={styles.featureText}>
              Entrenamiento adaptativo para
              bomberos y bomberas.
            </Text>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureDot} />

            <Text style={styles.featureText}>
              Misiones claras, seguras y
              explicables.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label="Comenzar"
            onPress={() =>
              router.push('/login')
            }
          />

          <Text style={styles.legal}>
            Sentinel Fire no sustituye atención
            médica ni determina aptitud laboral.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  content: {
    gap: 18,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '700',
  },
  description: {
    maxWidth: 560,
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 26,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureDot: {
    width: 9,
    height: 9,
    marginTop: 7,
    borderRadius: 5,
    backgroundColor: colors.brandCyan,
  },
  featureText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 18,
  },
  legal: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  logout: {
    color: colors.brandCyan,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});