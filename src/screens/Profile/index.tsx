import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';

export function Profile(): JSX.Element {
  return (
    <View>
      <Text>Perfil</Text>

      <TextInput placeholder="Nome" autoCorrect={false} />
      <TextInput placeholder="Sobrenome" />

      <Button title="Salvar" onPress={() => {}} />
    </View>
  );
}
