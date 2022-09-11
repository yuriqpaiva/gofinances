import React, { ReactNode } from 'react';
import { Register } from '.';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}));

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe('Register Screen', () => {
  it('should open category modal when user clicks on category button', async () => {
    const { getByTestId } = render(<Register />, { wrapper: Providers });

    const categoryModal = getByTestId('category-modal');
    const categoryButton = getByTestId('category-button');

    fireEvent.press(categoryButton);

    await waitFor(() => {
      expect(categoryModal.props.visible).toBeTruthy();
    });
  });
});
