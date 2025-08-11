import { Tabs, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import Header from '@/components/Header';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { getToken } from '@/hooks/useAuthToken';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname()
  const shouldShowHeader = pathname != '/QRcode'

  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getToken().then(token => {
      if (!token) {
        router.replace('/sign-in')
      }
      setLoading(false)
    })
  }, [])

  if(loading) return null
  
  return (
    <>
      { shouldShowHeader && <Header /> }
      <Tabs
        screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
          },
        }),
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Turmas',
            tabBarIcon: ({ color }) => <MaterialIcons name="class" size={24} color={color} />,
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="QRcode"
          options={{
            title: 'Presença',
            tabBarIcon: ({ color }) => <MaterialIcons name="qr-code-scanner" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <MaterialIcons name="face" size={24} color={color} />,
          }}
        ></Tabs.Screen>
      </Tabs>
    </>
  );
}
