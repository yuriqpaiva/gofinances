import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryCard } from '../../components/HistoryCard';
import { Container, Header, Title, Content, ChartContainer } from './styles';
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume(): JSX.Element {
  const theme = useTheme();
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    [],
  );

  async function loadData(): Promise<void> {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response !== null ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (expensive: TransactionData) => expensive.type === 'negative',
    );

    const expensivesTotal = expensives.reduce(
      (accumulator: number, expensive: TransactionData) => {
        return accumulator + Number(expensive.amount);
      },
      0,
    );

    const totalByCategory = categories.reduce(
      (acc: CategoryData[], category) => {
        let categorySum = 0;

        expensives.forEach((expensive: TransactionData) => {
          if (expensive.category === category.key) {
            categorySum += Number(expensive.amount);
          }
        });

        if (categorySum > 0) {
          const totalFormatted = categorySum.toLocaleString('pt-Br', {
            style: 'currency',
            currency: 'BRL',
          });

          const percent =
            ((categorySum / expensivesTotal) * 100).toFixed(0) + '%';

          return [
            ...acc,
            {
              key: category.key,
              name: category.name,
              total: categorySum,
              totalFormatted,
              color: category.color,
              percent,
            },
          ];
        }

        return acc;
      },
      [],
    );

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData().finally(() => {});
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        <ChartContainer>
          <VictoryPie
            data={totalByCategories}
            x="percent"
            y="total"
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape,
              },
            }}
            labelRadius={50}
            colorScale={totalByCategories.map(category => category.color)}
          />
        </ChartContainer>
        {totalByCategories.map(item => (
          <HistoryCard
            key={item.key}
            title={item.name}
            amount={item.totalFormatted}
            color={item.color}
          />
        ))}
      </Content>
    </Container>
  );
}
