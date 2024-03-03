import React from 'react';
import { Numerics, UNCATEGORIZED } from 'utilities/main';
import Table from 'components/shared/table';

const ExpenseCategoryTotals = ({ totalsByCategory, numMonths }) => {
  const tableColumns = [
    {
      key: 'category',
      header: 'Expense category',
      render: (i) => {

        return (
          <div className="flex-row">
            <div style={{ backgroundColor: i.color, height: '12px', width: '12px', borderRadius: '4px' }} />
            {i.category || UNCATEGORIZED}
          </div>
        );
      }
    },
    {
      key: 'amount',
      header: 'Amount',
      render: i => Numerics.centsToWholeDollars(i.amount)
    },
    {
      key: 'average',
      header: `Average (${numMonths} months)`,
      render: i => Numerics.centsToWholeDollars(i.amount / numMonths)
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
