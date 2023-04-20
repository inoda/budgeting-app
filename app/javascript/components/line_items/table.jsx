import React from 'react';
import DatePicker from 'react-datepicker';
import Table from 'components/shared/table';
import CurrencyField from 'components/shared/currency_field';
import Select from 'components/shared/select';
import { UNCATEGORIZED } from 'utilities/main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'

const LineItemsTable = ({ items, expenseCategories, onItemUpdate, onItemRemove, sortData, setSortData }) => {
  const selectOptions =
  [
    ...expenseCategories.map(c => {
      return { value: c.id, label: c.name }
    }),
    { value: null, label: UNCATEGORIZED },
  ]

  const tableColumns = [
    {
      key: 'transaction_date',
      header: 'Date',
      sortable: sortData && setSortData,
      width: '150px',
      render: (item) =>
        <DatePicker
          onChange={val => {
            if (!!val) onItemUpdate(item.id, { transaction_date: val })
          }}
          selected={new Date(item.transaction_date)}
        />
    },
    {
      key: 'expense_category_id',
      header: 'Category',
      width: '250px',
      render: (item) => {
        if (item.item_type === 'savings') {
          return (
            <div className="field">
              Savings
            </div>
          );
        }

        return (
          <Select
            options={selectOptions}
            onChange={val => onItemUpdate(item.id, { expense_category_id: val })}
            defaultValue={item.expense_category_id}
          />
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: sortData && setSortData,
      width: '200px',
      render: (item) =>
        <CurrencyField
          initialValue={item.amount}
          onBlur={val => {
            if (val === item.amount) return;
            onItemUpdate(item.id, { amount: val })
          }}
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
      width: '40px',
      render: (item) => (
        <button onClick={() => onItemRemove(item.id)} className="secondary">
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      ),
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
