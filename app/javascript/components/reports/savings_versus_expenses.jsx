import React from 'react';
import { Numerics } from 'utilities/main';
import Table from 'components/shared/table';

const ExpenseCategoryTotals = ({ expensesTotal, savingsTotal, numMonths }) => {
  const tableColumns = [
    { key: 'id', header: 'Type' },
    { key: 'amount', header: 'Amount' },
    { key: 'average', header: `Average (${numMonths} months)` },
  ];

  const items = [
    {
      id: 'Savings',
      amount: Numerics.centsToDollars(savingsTotal),
      average: Numerics.centsToDollars(savingsTotal / numMonths)
    },
    {
      id: 'Expenses',
      amount: Numerics.centsToDollars(expensesTotal),
      average: Numerics.centsToDollars(expensesTotal / numMonths)
    },
  ];

  return (
    <Table columnConfig={tableColumns} items={items} />
  );
}

export default ExpenseCategoryTotals;
