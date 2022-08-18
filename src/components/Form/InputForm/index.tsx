import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { Input } from '../Input';
import { Container } from './styles';

interface Props extends TextInputProps {
  control: Control<any>;
  name: string;
}

export function InputForm({ name, control, ...rest }: Props): JSX.Element {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input value={value} onChangeText={onChange} {...rest} />
        )}
        name={name}
      />
    </Container>
  );
}
