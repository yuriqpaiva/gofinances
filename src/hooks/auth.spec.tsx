import { AuthProvider, useAuth } from './auth';
import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('expo-linking', () => {
  const module: typeof import('expo-linking') = {
    ...jest.requireActual('expo-linking'),
    createURL: jest.fn(),
  };

  return module;
});

jest.mock('expo-auth-session/providers/google', () => {
  return {
    useAuthRequest: jest
      .fn()
      .mockReturnValue([
        { foo: true },
        { type: 'success', authentication: { accessToken: 'mock_token' } },
        jest.fn(),
      ]),
  };
});

describe('Auth Hook', () => {
  it('should be able to sign in with an existing Google Account', async () => {
    // Mocking User fetch return
    global.fetch = jest.fn(
      async () =>
        await Promise.resolve({
          json: async () =>
            await Promise.resolve({
              id: `userInfo.id`,
              email: `userInfo.email`,
              name: `userInfo.given_name`,
              photo: `userInfo.picture`,
              locale: `userInfo.locale`,
              verified_email: `userInfo.verified_email`,
            }),
        }),
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // Use act function when using state changes
    await act(async () => await result.current.signInWithGoogle());

    expect(result.current.user).toBeTruthy();
  });
});
