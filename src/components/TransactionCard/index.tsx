import React from 'react';
import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from './styles';

interface Props {
  data: {
    title: string;
    amount: string;
    category: {
      name: string;
      icon: string;
    };
    date: string;
  };
}

export function TransactionCard({ data }: Props): JSX.Element {
  return (
    <Container>
      <Title>{data.title}</Title>

      <Amount>{data.amount}</Amount>
      <Footer>
        <Category>
          <Icon name="dollar-sign" />
          <CategoryName>{data?.category?.name}</CategoryName>
        </Category>
        <Date>{data.date}</Date>
      </Footer>
    </Container>
  );
}
