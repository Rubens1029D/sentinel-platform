import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

const dsgLogo = require('../../assets/branding/dsg-logo.png');

type BrandHeaderProps = {
  compact?: boolean;
};

export function BrandHeader({ compact = false }: BrandHeaderProps) {
  return (
    <View style={styles.container}>
      <Image
        accessibilityLabel="DSG Solución"
        resizeMode="contain"
        source={dsgLogo}
        style={[styles.logo, compact && styles.logoCompact]}
      />

      <View>
        <Text style={styles.product}>SENTINEL FIRE</Text>
        <Text style={styles.poweredBy}>Una solución de DSG</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 92,
    height: 52,
  },
  logoCompact: {
    width: 68,
    height: 40,
  },
  product: {
    color: colors.textPrimary,
    fontSize: 17,
  fontWeight: '900',
    letterSpacing: 1.2,
  },
  poweredBy: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
