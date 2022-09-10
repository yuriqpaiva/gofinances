import React from 'react';
import { render } from '@testing-library/react-native';
import { Profile } from '../../screens/Profile';

test('check if user input name placeholder shows correctly', () => {
  const { getByPlaceholderText } = render(<Profile />);

  const inputName = getByPlaceholderText('Nome');

  expect(inputName).toBeTruthy();
});
