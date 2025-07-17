import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CustomTabButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  accessibilityState?: { selected?: boolean };
  accessibilityLabel?: string;
}

export default function CustomTabButton({
  onPress,
  onLongPress,
  children,
  accessibilityState,
  accessibilityLabel,
}: CustomTabButtonProps) {
  const colorScheme = useColorScheme();
  const isSelected = accessibilityState?.selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.tabButton,
        {
          backgroundColor: isSelected 
            ? (colorScheme === 'light' ? '#f0f8ff' : '#1a2332')
            : 'transparent',
          borderColor: isSelected 
            ? (colorScheme === 'light' ? '#0a7ea4' : '#FFFFFF')
            : 'transparent',
        }
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      accessibilityState={accessibilityState}
    >
      <View style={styles.tabContent}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 56,
  },
  tabContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
