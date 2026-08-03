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

const timeOptions = [10, 20, 30, 45, 60];

export default function AvailabilityStepScreen() {
  const [selectedMinutes, setSelectedMinutes] = useState<number | undefined>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <BrandHeader compact />

        <View style={styles.progress}>
          <Text style={styles.step}>PASO 7 DE 7</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>¿Cuánto tiempo puedes entrenar?</Text>

          <Text style={styles.subtitle}>
            Usaremos este tiempo para ajustar la duración de tus sesiones.
          </Text>
        </View>

        <View style={styles.options}>
          {timeOptions.map((minutes) => {
            const isSelected = selectedMinutes === minutes;

            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                key={minutes}
                onPress={() => setSelectedMinutes(minutes)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.optionValue,
                      isSelected && styles.optionValueSelected,
                    ]}
                  >
                    {minutes}
                  </Text>

                  <Text style={styles.optionLabel}>minutos</Text>
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

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Puedes cambiarlo después</Text>

          <Text style={styles.noticeText}>
            Sentinel ajustará cada sesión según tu disponibilidad real del día.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            disabled={selectedMinutes === undefined}
            label="Finalizar perfil"
            onPress={() => router.push('/complete')}
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
    width: '100%',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  option: {
    width: '47%',
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  optionValue: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '900',
  },
  optionValueSelected: {
    color: colors.primary,
  },
  optionLabel: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
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