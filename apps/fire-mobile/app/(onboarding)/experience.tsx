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

const experienceOptions = [
  { value: 0, label: 'Sin experiencia' },
  { value: 1, label: 'Menos de 1 año' },
  { value: 3, label: '1 a 3 años' },
  { value: 5, label: '4 a 5 años' },
  { value: 10, label: '6 a 10 años' },
  { value: 11, label: 'Más de 10 años' },
];

export default function ExperienceStepScreen() {
  const [selectedYears, setSelectedYears] = useState<number | undefined>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <BrandHeader compact />

        <View style={styles.progress}>
          <Text style={styles.step}>PAE 7</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>¿Cuánta experiencia tienes?</Text>

          <Text style={styles.subtitle}>
            Esto nos ayuda a ajustar la dificultad, volumen y progresión.
          </Text>
        </View>

        <View style={styles.options}>
          {experienceOptions.map((option) => {
            const isSelected = selectedYears === option.value;

            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                key={option.value}
                onPress={() => setSelectedYears(option.value)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>

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
            disabled={selectedYears === undefined}
            label="Continuar"
            onPress={() => router.push('/fitness')}
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
    width: '42.84%',
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
  optionLabel: {
    color: colors.textSecondary,
    fontSize: 17,
    fontWeight: '700',
  },
  optionLabelSelected: {
    color: colors.textPrimary,
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
