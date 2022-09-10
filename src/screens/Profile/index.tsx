import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';

export function Profile(): JSX.Element {
  return (
    <View>
      <Text testID="text-title">Perfil</Text>

      <TextInput
        placeholder="Nome"
        autoCorrect={false}
        testID="input-name"
        value="Yuri"
      />
      <TextInput
        placeholder="Sobrenome"
        testID="input-surname"
        value="Queiroz"
      />

      <Button title="Salvar" onPress={() => {}} />
    </View>
  );
}
