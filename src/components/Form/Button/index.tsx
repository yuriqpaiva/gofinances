import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { Container, Title } from './styles';

interface Props extends RectButtonProps {
  title: string;
}

export function Button({ title, ...rest }: Props): JSX.Element {
  return (
    <Container {...rest}>
      <Title>{title}</Title>
    </Container>
  );
}
