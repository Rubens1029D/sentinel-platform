import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import {
  restoreSession,
  useAuthStore,
} from '@/stores/auth-store';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  const { initialized } =
    useAuthStore();

  useEffect(() => {
    void restoreSession();
  }, []);

  if (!initialized) {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />

        <ActivityIndicator
          color={colors.primary}
          size="large"
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});