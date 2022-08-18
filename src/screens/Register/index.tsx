import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Modal } from 'react-native';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';

interface FormData {
  name: string;
  amount: string;
}

export function Register(): JSX.Element {
  const [transactionType, setTransactionType] = useState<'up' | 'down' | ''>(
    '',
  );

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  function handleTransactionTypeSelect(type: 'up' | 'down'): void {
    setTransactionType(type);
  }

  function handleOpenSelectCategory(): void {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategory(): void {
    setCategoryModalOpen(false);
  }

  const { control, handleSubmit } = useForm<FormData>();

  const handleRegister: SubmitHandler<FormData> = data => console.log(data);

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <InputForm placeholder="Nome" name="name" control={control} />
          <InputForm placeholder="Preço" name="price" control={control} />
          <TransactionsTypes>
            <TransactionTypeButton
              type="up"
              title="Income"
              onPress={() => handleTransactionTypeSelect('up')}
              isActive={transactionType === 'up'}
            />
            <TransactionTypeButton
              type="down"
              title="Outcome"
              onPress={() => handleTransactionTypeSelect('down')}
              isActive={transactionType === 'down'}
            />
          </TransactionsTypes>
          <CategorySelectButton
            title={category.name}
            onPress={handleOpenSelectCategory}
          />
        </Fields>

        <Modal visible={categoryModalOpen} animationType="slide">
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategory}
          />
        </Modal>

        <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
      </Form>
    </Container>
  );
}
