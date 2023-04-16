import React, { useState, useEffect, useMemo } from 'react';
import { LineItems } from 'requests/resources';
import Paginator, { STARTING_STATE } from 'components/shared/paginator';
import Table from 'components/shared/table';
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
  const [paginationData, setPaginationData] = useState(STARTING_STATE);
  const [sortData, setSortData] = useState({ sort: 'transaction_date', sortDesc: true });
  const [search, setSearch] = useState('');
  const [timeframe, setTimeframe] = useState('last_90_days');
  const [transactionDateMin, setTransactionDateMin] = useState(getTimeframeBounds(timeframe).min);
  const [transactionDateMax, setTransactionDateMax] = useState(getTimeframeBounds(timeframe).max);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [refreshPageTrigger, setRefreshPageTrigger] = useState(0);

  const params = {
    search,
    includeCategory: true,
    transactionDateMin: transactionDateMin ? moment(transactionDateMin).unix() : null,
    transactionDateMax: transactionDateMax ? moment(transactionDateMax).unix() : null,
    ...sortData,
  };

  useEffect(() => {
    LineItems.paginatedList(params, paginationData).then(
      (resp) => {
        setItems(resp.items);
        setPaginationData(resp.pagination_data);
      },
      () => { console.error('TODO') },
    );
  }, [JSON.stringify(params), refreshPageTrigger])

  const deleteItem = (itemId) => {
    Alerts.genericDelete('item').then((result) => {
      if (!result.value) { return; }

      LineItems.delete(itemId).then(
        () => {
          setRefreshPageTrigger(refreshPageTrigger + 1);
          Alerts.success('The item was deleted');
        },
        () => { Alerts.genericError() },
      );
    });
  }

  const changeTimeframe = (val) => {
    const bounds = getTimeframeBounds(val);
    setTimeframe(val);
    setTransactionDateMin(bounds.min);
    setTransactionDateMax(bounds.max);
    setPaginationData({ ...paginationData, page: 1 });
  }

  const changeSearch = Debounce.call((val) => {
    setSearch(val);
  }, 500);

  const tableColumns = [
    {
      key: 'transaction_date',
      render: (item) => { return item.transaction_date },
      header: 'Date',
      sortable: true,
    },
    {
      key: 'expense_category',
      render: (item) => { return item.expense_category?.name },
      header: 'Category',
    },
    {
      key: 'amount',
      render: (item) => { return item.amount },
      header: 'Amount',
      sortable: true,
    },
    {
      key: 'memo',
      render: (item) => { return item.memo },
      header: 'Memo',
    },
    {
      key: 'actions',
      render: (item) => { return <button onClick={() => deleteItem(item.id)}>x</button> },
      header: '',
    },
  ]

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
              <DatePicker selected={transactionDateMin} onChange={d => setTransactionDateMin(d)} />
              <DatePicker selected={transactionDateMax} onChange={d => setTransactionDateMax(d)} />
            </>
          )}
        </div>
      </div>

      <Table
        columnConfig={tableColumns}
        items={items}
        onSortChange={sortData => setSortData(sortData)}
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
