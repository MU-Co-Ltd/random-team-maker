import { Tabs } from 'expo-router'
import { Platform } from 'react-native'

import { IconSymbol } from '@/components/ui/IconSymbol'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'light' ? '#0a7ea4' : '#FFFFFF',
        tabBarInactiveTintColor: colorScheme === 'light' ? '#666666' : '#9BA1A6',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 84,
            paddingBottom: 28,
            paddingTop: 0,
            backgroundColor: colorScheme === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(21,23,24,0.95)',
            borderTopColor: colorScheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
            borderTopWidth: 0.5,
          },
          default: {
            height: 76,
            paddingBottom: 12,
            paddingTop: 0,
            backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#151718',
            borderTopColor: colorScheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
            borderTopWidth: 0.5,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 2,
          color: colorScheme === 'light' ? '#333333' : '#FFFFFF',
        },
        tabBarItemStyle: {
          paddingTop: 6,
          paddingBottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          minHeight: 60,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'チーム分け',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 26 : 22} 
              name="shuffle" 
              color={color || (colorScheme === 'light' ? (focused ? '#0a7ea4' : '#666666') : (focused ? '#FFFFFF' : '#9BA1A6'))} 
            />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
            marginBottom: 2,
            color: colorScheme === 'light' ? '#333333' : '#FFFFFF',
          },
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'メンバー管理',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 22}
              name="person.fill.badge.plus"
              color={color || (colorScheme === 'light' ? (focused ? '#0a7ea4' : '#666666') : (focused ? '#FFFFFF' : '#9BA1A6'))}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
            marginBottom: 2,
            color: colorScheme === 'light' ? '#333333' : '#FFFFFF',
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '履歴',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 22}
              name="clock.fill"
              color={color || (colorScheme === 'light' ? (focused ? '#0a7ea4' : '#666666') : (focused ? '#FFFFFF' : '#9BA1A6'))}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
            marginBottom: 2,
            color: colorScheme === 'light' ? '#333333' : '#FFFFFF',
          },
        }}
      />
    </Tabs>
  )
}
