import { router } from 'expo-router';
import { useState } from 'react';
import {
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

export default function ProfileStepScreen() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const ageValue = Number(age);
  const heightValue = Number(height);
  const weightValue = Number(weight);

  const isValid =
    ageValue >= 18 &&
    ageValue <= 80 &&
    heightValue >= 120 &&
    heightValue <= 230 &&
    weightValue >= 40 &&
    weightValue <= 250;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <BrandHeader compact />

        <View style={styles.progress}>
          <Text style={styles.step}>PASO 1 DE 7</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Cuéntanos sobre ti</Text>
          <Text style={styles.subtitle}>
            Usaremos esta información para ajustar tu entrenamiento.
          </Text>
        </View>

        <View style={styles.form}>
          <TextField
            keyboardType="numeric"
            label="Edad"
            onChangeText={(value) => setAge(value.replace(/\D/g, ''))}
            placeholder="Ej. 35"
            value={age}
          />

          <TextField
            keyboardType="numeric"
            label="Altura en centímetros"
            onChangeText={(value) => setHeight(value.replace(/\D/g, ''))}
            placeholder="Ej. 175"
            value={height}
          />

          <TextField
            keyboardType="numeric"
            label="Peso en kilogramos"
            onChangeText={(value) => setWeight(value.replace(/\D/g, ''))}
            placeholder="Ej. 85"
            value={weight}
          />
        </View>

        <PrimaryButton
          disabled={!isValid}
          label="Continuar"
          onPress={() => router.push('/role')}
        />
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
    gap: 32,
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
    width: '14.28%',
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
  form: {
    gap: 18,
    flex: 1,
  },
});
