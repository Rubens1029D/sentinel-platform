import { router } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BrandHeader } from '@/components/ui/BrandHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors } from '@/theme/colors';

export default function OnboardingCompleteScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BrandHeader />

        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓</Text>
          </View>

          <Text style={styles.title}>Tu perfil está listo</Text>

          <Text style={styles.subtitle}>
            Sentinel ya puede empezar a adaptar tu preparación a tu experiencia,
            condición física, equipo y tiempo disponible.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label="Ir al inicio"
            onPress={() => router.replace('/')}
          />
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
    paddingVertical: 32,
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 42,
    fontWeight: '900',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
  },
  actions: {
    gap: 18,
  },
});