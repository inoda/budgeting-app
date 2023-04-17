import React from 'react';
import DatePicker from 'react-datepicker';
import Table from 'components/shared/table';
import CurrencyField from 'components/shared/currency_field';

const LineItemsTable = ({ items, expenseCategories, onItemUpdate, onItemRemove, sortData, setSortData }) => {
  const tableColumns = [
    {
      key: 'transaction_date',
      header: 'Date',
      sortable: sortData && setSortData,
      render: (item) =>
        <DatePicker
          onChange={val => onItemUpdate(item.id, { transaction_date: val })}
          selected={new Date(item.transaction_date)}
        />
    },
    {
      key: 'expense_category_id',
      header: 'Category',
      render: (item) => {
        if (item.item_type === 'savings') return 'Savings';

        return (
          <select
            defaultValue={item.expense_category_id}
            onChange={e => onItemUpdate(item.id, { expense_category_id: e.target.value })}
            placeholder="Select"
          >
            <option value="">Uncategorized</option>
            {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: sortData && setSortData,
      render: (item) =>
        <CurrencyField
          initialValue={item.amount}
          onBlur={val => onItemUpdate(item.id, { amount: val })}
        />
    },
    {
      key: 'memo',
      header: 'Memo',
      render: (item) =>
        <input
          defaultValue={item.memo}
          onBlur={e => {
            if (e.target.value.trim() === item.memo) return;
            onItemUpdate(item.id, { memo: e.target.value.trim() });
          }}
        />
    },
    {
      key: 'actions',
      header: '',
      render: (item) => <button onClick={() => onItemRemove(item.id)}>x</button>,
    },
  ];

  return (
    <Table
      columnConfig={tableColumns}
      items={items}
      sortData={sortData}
      onSortChange={setSortData}
    />
  );
};

export default LineItemsTable;
