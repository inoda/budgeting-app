import React, { useState, useEffect } from 'react';
import { LineItems, ExpenseCategories } from 'requests/resources';
import Paginator, { STARTING_STATE } from 'components/shared/paginator';
import Table from 'components/shared/table';
import CurrencyField from 'components/shared/currency_field';
import CreateModal from './create_modal';
import DatePicker from 'react-datepicker';
import { Alerts, Debounce } from 'utilities/main';
import moment from 'moment';

const getTimeframeBounds = (t) => {
  return {
    'current_month': { min: moment().startOf('month').toDate(), max: moment().toDate() },
    'last_90_days': { min: moment().subtract(90, 'days').toDate(), max: moment().toDate() },
    'ytd': { min: moment().startOf('year').toDate(), max: moment().toDate() },
    'custom': { label: 'Custom', min: undefined, max: undefined },
  }[t];
}

const List = () => {
  const [items, setItems] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [paginationData, setPaginationData] = useState(STARTING_STATE);
  const [sortData, setSortData] = useState({ sort: 'transaction_date', sortDesc: true });
  const [search, setSearch] = useState('');
  const changeSearch = Debounce.call(setSearch, 500);
  const [timeframe, setTimeframe] = useState('last_90_days');
  const [transactionDateMin, setTransactionDateMin] = useState(getTimeframeBounds(timeframe).min);
  const [transactionDateMax, setTransactionDateMax] = useState(getTimeframeBounds(timeframe).max);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [refreshPageTrigger, setRefreshPageTrigger] = useState(0);
  const refreshCurrentPage = () => setRefreshPageTrigger(refreshPageTrigger + 1);

  const lineItemParams = {
    search,
    transactionDateMin: transactionDateMin ? moment(transactionDateMin).unix() : null,
    transactionDateMax: transactionDateMax ? moment(transactionDateMax).unix() : null,
    ...sortData,
  };

  useEffect(() => {
    ExpenseCategories.list().then(setExpenseCategories, Alerts.genericError);
  }, []);

  useEffect(() => {
    LineItems.paginatedList(lineItemParams, paginationData).then(
      (resp) => {
        setItems(resp.items);
        setPaginationData(resp.pagination_data);
      },
      Alerts.genericError,
    );
  }, [JSON.stringify(lineItemParams), refreshPageTrigger]);

  const deleteItem = (itemId) => {
    Alerts.genericDelete('item').then((result) => {
      if (!result.value) { return; }

      LineItems.delete(itemId).then(
        () => {
          refreshCurrentPage();
          Alerts.success('The item was deleted');
        },
        Alerts.genericError,
      );
    });
  };

  const updateItem = (id, updates) => {
    LineItems.update(id, updates).then(
      () => {
        refreshCurrentPage();
        Alerts.success('The item was updated');
      },
      Alerts.genericError
    );
  };

  const changeTimeframe = (val) => {
    const bounds = getTimeframeBounds(val);
    setTimeframe(val);
    setTransactionDateMin(bounds.min);
    setTransactionDateMax(bounds.max);
    setPaginationData({ ...paginationData, page: 1 });
  };

  const tableColumns = [
    {
      key: 'transaction_date',
      header: 'Date',
      sortable: true,
      render: (item) =>
        <DatePicker
          onChange={val => updateItem(item.id, { transaction_date: val })}
          selected={new Date(item.transaction_date)}
        />
    },
    {
      key: 'expense_category',
      header: 'Category',
      render: (item) => {
        if (item.item_type === 'savings') return 'Savings';

        return (
          <select
            defaultValue={item.expense_category_id}
            onChange={e => updateItem(item.id, { expense_category_id: e.target.value })}
          >
            {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (item) =>
        <CurrencyField
          initialValue={item.amount}
          onBlur={val => updateItem(item.id, { amount: val })}
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
            updateItem(item.id, { memo: e.target.value.trim() });
          }}
        />
    },
    {
      key: 'actions',
      header: '',
      render: (item) => <button onClick={() => deleteItem(item.id)}>x</button>,
    },
  ];

  return (
    <>
      <div>
        <div>
          <button onClick={setAddItemOpen}>+ Add items</button>
          {addItemOpen && <CreateModal />}
        </div>

        <div>
          <input placeholder="Search memo or category" onChange={e => changeSearch(e.target.value)} />

          <select onChange={e => changeTimeframe(e.target.value)} defaultValue={timeframe}>
            <option value='current_month'>Current month</option>
            <option value='last_90_days'>Last 90 days</option>
            <option value='ytd'>Year to date</option>
            <option value='custom'>Custom timeframe</option>
          </select>

          {timeframe === 'custom' && (
            <>
              <DatePicker selected={transactionDateMin} onChange={setTransactionDateMin} />
              <DatePicker selected={transactionDateMax} onChange={setTransactionDateMax} />
            </>
          )}
        </div>
      </div>

      <Table
        columnConfig={tableColumns}
        items={items}
        onSortChange={setSortData}
        sortData={sortData}
      />

      <Paginator
        paginationData={paginationData}
        onChange={page => setPaginationData({ ...paginationData, page })}
      />
    </>
  );
}

export default List;
