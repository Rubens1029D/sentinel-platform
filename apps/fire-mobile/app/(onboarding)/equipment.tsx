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
import type { Equipment } from '@/types/onboarding';

const equipmentOptions: {
  value: Equipment;
  title: string;
  description: string;
}[] = [
  {
    value: 'scba',
    title: 'Equipo de respiración autónoma',
    description: 'ERA o equipo equivalente.',
  },
  {
    value: 'jacket',
    title: 'Chaquetón',
    description: 'Equipo estructural o de protección.',
  },
  {
    value: 'helmet',
    title: 'Casco',
    description: 'Casco operativo de protección.',
  },
  {
    value: 'boots',
    title: 'Botas',
    description: 'Botas de trabajo o estructurales.',
  },
  {
    value: 'ladder',
    title: 'Escalera',
    description: 'Escalera portátil para prácticas.',
  },
  {
    value: 'hose',
    title: 'Manguera',
    description: 'Manguera de entrenamiento o servicio.',
  },
];

export default function EquipmentStepScreen() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

  const toggleEquipment = (equipment: Equipment) => {
    setSelectedEquipment((current) => {
      if (current.includes(equipment)) {
        return current.filter((item) => item !== equipment);
      }

      return [...current, equipment];
    });
  };

  const selectAll = () => {
    setSelectedEquipment(equipmentOptions.map((option) => option.value));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <BrandHeader compact />

        <View style={styles.progress}>
          <Text style={styles.step}>PASO 6 DE 7</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>¿Qué equipo tienes disponible?</Text>

          <Text style={styles.subtitle}>
            Selecciona todo el equipo que podrías utilizar durante tus
            entrenamientos.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={selectAll}
          style={styles.selectAllButton}
        >
          <Text style={styles.selectAllText}>Seleccionar todo</Text>
        </Pressable>

        <View style={styles.options}>
          {equipmentOptions.map((option) => {
            const isSelected = selectedEquipment.includes(option.value);

            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                key={option.value}
                onPress={() => toggleEquipment(option.value)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isSelected && styles.optionTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>

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

        <View style={styles.actions}>
          <PrimaryButton
            disabled={selectedEquipment.length === 0}
            label="Continuar"
            onPress={() => router.push('/availability')}
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
    width: '85.68%',
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
  selectAllButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.brandCyan,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  selectAllText: {
    color: colors.brandCyan,
    fontSize: 14,
    fontWeight: '800',
  },
  options: {
    gap: 14,
  },
  option: {
    minHeight: 88,
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
    color: colors.textSecondary,
    fontSize: 17,
    fontWeight: '800',
  },
  optionTitleSelected: {
    color: colors.textPrimary,
  },
  optionDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
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