import { AuthProvider, useAuth } from './auth';
import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'jest-mock';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-linking', () => {
  const module: typeof import('expo-linking') = {
    ...jest.requireActual('expo-linking'),
    createURL: jest.fn(),
  };

  return module;
});

jest.mock('expo-auth-session/providers/google', () => {
  return {
    useAuthRequest: jest.fn(),
  };
});

describe('Auth Hook', () => {
  beforeEach(async () => {
    const userCollectionKey = '@gofinances:user';
    await AsyncStorage.removeItem(userCollectionKey);
  });

  it('should be able to sign in with an existing Google Account', async () => {
    const googleMocked = mocked(useAuthRequest as any);
    googleMocked.mockReturnValue([
      { foo: true },
      { type: 'success', authentication: { accessToken: 'mock_token' } },
      jest.fn(),
    ]);

    // Mocking User fetch return
    global.fetch = jest.fn(
      async () =>
        await Promise.resolve({
          json: async () =>
            await Promise.resolve({
              id: 'userInfo.id',
              email: 'userInfo.email',
              name: 'userInfo.given_name',
              photo: 'userInfo.picture',
              locale: 'userInfo.locale',
              verified_email: 'userInfo.verified_email',
            }),
        }),
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // Use act function when using state changes
    await act(async () => await result.current.signInWithGoogle());

    expect(result.current.user?.email).toEqual('userInfo.email');
  });

  it('should not connect user when Google Authentication is cancelled', async () => {
    const googleMocked = mocked(useAuthRequest as any);
    googleMocked.mockReturnValue([
      { foo: true },
      { type: 'cancel' },
      jest.fn(),
    ]);

    // Mocking User fetch return
    global.fetch = jest.fn(
      async () =>
        await Promise.resolve({
          json: async () =>
            await Promise.resolve({
              id: 'userInfo.id',
              email: 'userInfo.email',
              name: 'userInfo.given_name',
              photo: 'userInfo.picture',
              locale: 'userInfo.locale',
              verified_email: 'userInfo.verified_email',
            }),
        }),
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // Use act function when using state changes
    await act(async () => await result.current.signInWithGoogle());

    expect(result.current?.user).toEqual(null);
  });

  it('should returns error when Google SignIn fails', async () => {
    const googleMocked = mocked(useAuthRequest as any);
    googleMocked.mockReturnValue([
      { foo: true },
      { type: 'success', authentication: { accessToken: 'mock_token' } },
      jest.fn(),
    ]);

    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => await result.current.signInWithGoogle());
    expect(result.current.user).toEqual(null);
  });
});
