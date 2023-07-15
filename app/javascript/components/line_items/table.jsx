import React from 'react';
import DatePicker from 'react-datepicker';
import Table from 'components/shared/table';
import CurrencyField from 'components/shared/currency_field';
import Select from 'components/shared/select';
import { UNCATEGORIZED } from 'utilities/main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tooltip'
import { Numerics } from 'utilities/main';

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
      key: 'memo',
      header: 'Memo',
      render: (item) =>
        <input
          defaultValue={item.memo}
          spellcheck="false"
          onBlur={e => {
            if (e.target.value.trim() === item.memo) return;
            onItemUpdate(item.id, { memo: e.target.value.trim() });
          }}
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
      key: 'actions',
      header: '',
      width: '40px',
      render: (item) => {
        let tooltipContent = '';
        if (item.similar_item) {
          const dateContent = item.similar_item.is_same_day ? 'same day' : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(item.similar_item.transaction_date));
          const amountContent = item.similar_item.is_same_amount ? 'Same amount' : Numerics.centsToDollars(item.similar_item.amount);
          tooltipContent = `${amountContent} on ${dateContent}`;
        }

        return (
          <div className='flex-row'>
            <FontAwesomeIcon icon={faXmark} onClick={() => onItemRemove(item.id)} className="clickable hover-spin" />

            {item.similar_item && (
              <a
                data-tooltip-id={item.id}
                data-tooltip-content={tooltipContent}
                className="clickable"
              >
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <Tooltip id={item.id} />
              </a>
            )}
          </div>
        );
      }
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
