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

interface Data {
  type: 'positive' | 'negative';
  title: string;
  amount: string;
  category: {
    name: string;
    icon: string;
  };
  date: string;
}

interface Props {
  data: Data;
}

export function TransactionCard({ data }: Props): JSX.Element {
  return (
    <Container>
      <Title>{data.title}</Title>

      <Amount type={data.type}>
        {data.type === 'negative' && '- '}
        {data.amount}
      </Amount>
      <Footer>
        <Category>
          <Icon name={data.category.icon} />
          <CategoryName>{data?.category?.name}</CategoryName>
        </Category>
        <Date>{data.date}</Date>
      </Footer>
    </Container>
  );
}
