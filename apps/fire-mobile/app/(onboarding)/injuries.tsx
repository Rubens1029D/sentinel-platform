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
import type { InjuryArea } from '@/types/onboarding';

const injuryOptions: {
  value: InjuryArea;
  title: string;
}[] = [
  {
    value: 'knee',
    title: 'Rodilla',
  },
  {
    value: 'back',
    title: 'Espalda',
  },
  {
    value: 'shoulder',
    title: 'Hombro',
  },
  {
    value: 'ankle',
    title: 'Tobillo',
  },
  {
    value: 'none',
    title: 'Ninguna',
  },
];

export default function InjuriesStepScreen() {
  const [selectedInjuries, setSelectedInjuries] = useState<InjuryArea[]>([]);

  const toggleInjury = (injury: InjuryArea) => {
    if (injury === 'none') {
      setSelectedInjuries(['none']);
      return;
    }

    setSelectedInjuries((current) => {
      const withoutNone = current.filter((item) => item !== 'none');

      if (withoutNone.includes(injury)) {
        return withoutNone.filter((item) => item !== injury);
      }

      return [...withoutNone, injury];
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <BrandHeader compact />

        <View style={styles.progress}>
          <Text style={styles.step}>PASO 5 DE 7</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>
            ¿Tienes alguna lesión o molestia?
          </Text>

          <Text style={styles.subtitle}>
            Selecciona todas las opciones que debamos considerar al adaptar tu
            entrenamiento.
          </Text>
        </View>

        <View style={styles.options}>
          {injuryOptions.map((option) => {
            const isSelected = selectedInjuries.includes(option.value);

            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                key={option.value}
                onPress={() => toggleInjury(option.value)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionTitle,
                    isSelected && styles.optionTitleSelected,
                  ]}
                >
                  {option.title}
                </Text>

                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Importante</Text>

          <Text style={styles.noticeText}>
            Sentinel Fire no diagnostica lesiones ni sustituye la valoración de
            un profesional de la salud.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            disabled={selectedInjuries.length === 0}
            label="Continuar"
            onPress={() => router.push('/equipment')}
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
    width: '71.4%',
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
  },
  option: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#211C1A',
  },
  optionTitle: {
    color: colors.textSecondary,
    fontSize: 17,
    fontWeight: '700',
  },
  optionTitleSelected: {
    color: colors.textPrimary,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: colors.textMuted,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '900',
  },
  notice: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 6,
  },
  noticeTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  noticeText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
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