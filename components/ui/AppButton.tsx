import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type AppButtonVariant = 'primary' | 'secondary' | 'inverted' | 'ghost';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: AppButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const PRIMARY_COLOR = '#3629B7';

export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  textStyle,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = getVariantStyle(variant);

  return (
    <TouchableOpacity
      style={[styles.base, variantStyle.container, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.9}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.activityIndicatorColor} />
      ) : (
        <Text style={[styles.text, variantStyle.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

function getVariantStyle(variant: AppButtonVariant) {
  switch (variant) {
    case 'secondary':
      return {
        container: styles.secondaryContainer,
        text: styles.secondaryText,
        activityIndicatorColor: '#4B5563',
      };
    case 'inverted':
      return {
        container: styles.invertedContainer,
        text: styles.invertedText,
        activityIndicatorColor: PRIMARY_COLOR,
      };
    case 'ghost':
      return {
        container: styles.ghostContainer,
        text: styles.ghostText,
        activityIndicatorColor: '#FFFFFF',
      };
    case 'primary':
    default:
      return {
        container: styles.primaryContainer,
        text: styles.primaryText,
        activityIndicatorColor: '#FFFFFF',
      };
  }
}

const styles = StyleSheet.create({
  base: {
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryContainer: {
    backgroundColor: PRIMARY_COLOR,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryText: {
    color: '#4B5563',
  },
  invertedContainer: {
    backgroundColor: '#FFFFFF',
  },
  invertedText: {
    color: PRIMARY_COLOR,
  },
  ghostContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  ghostText: {
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
});
