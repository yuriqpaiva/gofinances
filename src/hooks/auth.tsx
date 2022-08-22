import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
const { GOOGLE_ANDROID_CLIENT_ID } = process.env;
const { GOOGLE_IOS_CLIENT_ID } = process.env;
const { GOOGLE_EXPO_CLIENT_ID } = process.env;

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email: string | null;
  name: string | null | undefined;
  photo: undefined;
}

interface AuthContextData {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [userStorageLoading, setUserStorageLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const userStorageKey = '@gofinances:user';

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const userStorage = await AsyncStorage.getItem(userStorageKey);

      if (userStorage !== null) {
        const userLogged = JSON.parse(userStorage) as User;
        setUser(userLogged);
      }

      setUserStorageLoading(false);
    }
    loadStorageData().finally(() => {});
  }, []);

  const [, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    expoClientId: GOOGLE_EXPO_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      getGoogleUser(authentication!.accessToken).finally(() => {});
    }
  }, [response]);

  async function signInWithGoogle(): Promise<void> {
    await promptAsync({ useProxy: true, showInRecents: true });
  }

  async function getGoogleUser(accessToken: string): Promise<void> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const userInfo = await response.json();

      const userLogged = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.given_name,
        photo: userInfo.photo,
      };

      await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      setUser(userLogged);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async function signInWithApple(): Promise<void> {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const userLogged = {
        id: String(credential.user),
        email: credential.email,
        name: credential.fullName?.givenName,
        photo: undefined,
      };

      setUser(userLogged);
      await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
    } catch (error) {
      throw new Error(error as string);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithApple }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
