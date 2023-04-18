import React from 'react';
import { Numerics, UNCATEGORIZED } from 'utilities/main';
import Table from 'components/shared/table';

const ExpenseCategoryTotals = ({ totalsByCategory, numMonths }) => {
  const tableColumns = [
    {
      key: 'category',
      header: 'Category',
      render: (i) => {

        return (
          <>
            <div style={{ backgroundColor: i.color, height: '10px', width: '10px' }} />
            {i.category || UNCATEGORIZED}
          </>
        );
      }
    },
    {
      key: 'amount',
      header: 'Amount',
      render: i => Numerics.centsToDollars(i.amount)
    },
    {
      key: 'average',
      header: `Average (${numMonths} months)`,
      render: i => Numerics.centsToDollars(i.amount / numMonths)
    },
  ];

  return (
    <Table
      columnConfig={tableColumns}
      items={totalsByCategory}
      idFunc={i => i.category}
    />
  );
}

export default ExpenseCategoryTotals;
