import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BrandHeader } from '@/components/ui/BrandHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors } from '@/theme/colors';
import type { OperationalRole } from '@/types/onboarding';

const roleOptions: {
  value: OperationalRole;
  title: string;
  description: string;
}[] = [
  {
    value: 'firefighter',
    title: 'Bombero o bombera',
    description: 'Servicio operativo en cuerpo de bomberos.',
  },
  {
    value: 'industrial-brigade',
    title: 'Brigadista industrial',
    description: 'Respuesta a emergencias dentro de una organización.',
  },
  {
    value: 'civil-protection',
    title: 'Protección Civil',
    description: 'Prevención, atención y coordinación de emergencias.',
  },
  {
    value: 'rescuer',
    title: 'Rescatista',
    description: 'Búsqueda, rescate y atención en escenarios críticos.',
  },
];

export default function RoleStepScreen() {
  const [selectedRole, setSelectedRole] =
    useState<OperationalRole | undefined>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <BrandHeader compact />

        <View style={styles.progress}>
          <Text style={styles.step}>PASO 2 DE 7</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>¿Cuál es tu función?</Text>

          <Text style={styles.subtitle}>
  Adaptaremos el entrenamiento a las exigencias de tu actividad.
</Text>
        </View>

        <View style={styles.options}>
          {roleOptions.map((option) => {
            const isSelected = selectedRole === option.value;

            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                key={option.value}
                onPress={() => setSelectedRole(option.value)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    {option.title}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    isSelected && styles.radioSelected,
                  ]}
                >
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            disabled={!selectedRole}
            label="Continuar"
            onPress={() => router.push('/experience')}
          />

          <Text
            accessibilityRole="link"
            onPress={() => router.back()}
            style={styles.back}
          >
            Volver
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 30,
  },
  progress: {
    gap: 10,
  },
  step: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  progressTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  progressFill: {
    width: '28.56%',
    height: '100%',
    backgroundColor: colors.primary,
  },
  header: {
    gap: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 17,
    lineHeight: 26,
  },
  options: {
    gap: 14,
    flex: 1,
  },
  option: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 18,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#211C1A',
  },
  optionContent: {
    flex: 1,
    gap: 6,
  },
  optionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  optionDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  actions: {
    gap: 18,
  },
  back: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
