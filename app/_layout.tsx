import { Provider } from '@/src/components/ui/provider';
import { Toaster } from '@/src/components/ui/toaster';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { paletasCores } from '@/utils/colors';

// Tema customizado do React Native Paper com as cores do Bookly
const booklyTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: paletasCores.principal.solido, // #0d2f2c
    primaryContainer: '#e8f5e9',
    secondary: paletasCores.verde.solido,
    secondaryContainer: '#e8f5e9',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    background: '#eeecda',
    error: paletasCores.vermelho.solido,
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#333333',
    onSurfaceVariant: '#666666',
    onError: '#ffffff',
    outline: '#cccccc',
  },
};

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Aguardar um tick para garantir que o componente está montado
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || isLoading) return; // Não navegar até estar pronto e sessão carregada

    const inAuthGroup = segments[0] === '(private)';
    
    if (isAuthenticated && !inAuthGroup) {
      // Se está autenticado mas não está na área privada, redirecionar para home
      router.replace('/(private)/home');
    } else if (!isAuthenticated && inAuthGroup) {
      // Se não está autenticado mas está na área privada, redirecionar para login
      router.replace('/(public)/login');
    }
  }, [isAuthenticated, isLoading, segments, isReady, router]);

  return (
    <Stack>
      {/* Rotas públicas - rota padrão */}
      <Stack.Screen 
        name="(public)" 
        options={{ headerShown: false }} 
      />
      
      {/* Rotas privadas */}
      <Stack.Screen 
        name="(private)" 
        options={{ headerShown: false }} 
      />
      
      {/* Rotas antigas (tabs) - podem ser removidas depois */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen name="+not-found" />
      
      {/* Rota raiz */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider theme={booklyTheme}>
      <Provider>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutNav />
            <StatusBar style="auto" />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </PaperProvider>
  );
}
