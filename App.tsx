import React, { useCallback, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './src/global/styles/theme';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/hooks/auth';
import { Routes } from './src/routes';

export default function App(): JSX.Element | null {
  const { userStorageLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    async function prepare(): Promise<void> {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare().finally(() => {});
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
    return fontsLoaded;
  }, [fontsLoaded]);

  if (!fontsLoaded || userStorageLoading) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
