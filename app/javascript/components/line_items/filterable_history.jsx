import React, { useState, useEffect } from 'react';
import { LineItems, ExpenseCategories } from 'requests/resources';
import Paginator, { STARTING_STATE } from 'components/shared/paginator';
import LineItemsTable from './table';
import ImportModal from './import_modal';
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

const FilterableHistory = () => {
  const [items, setItems] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState(undefined);
  const [paginationData, setPaginationData] = useState(STARTING_STATE);
  const [sortData, setSortData] = useState({ sort: 'transaction_date', sortDesc: true });
  const [search, setSearch] = useState('');
  const changeSearch = Debounce.call(setSearch, 500);
  const [timeframe, setTimeframe] = useState('last_90_days');
  const [transactionDateMin, setTransactionDateMin] = useState(getTimeframeBounds(timeframe).min);
  const [transactionDateMax, setTransactionDateMax] = useState(getTimeframeBounds(timeframe).max);
  const [importOpen, setImportOpen] = useState(false);
  const [refreshPageTrigger, setRefreshPageTrigger] = useState(0);
  const refreshCurrentPage = () => setRefreshPageTrigger(refreshPageTrigger + 1);
  const bumpToFirstPage = () => { if (paginationData.page != 1) setPaginationData({ ...paginationData, page: 1 }) };

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
  }, [JSON.stringify(lineItemParams), paginationData.page, refreshPageTrigger]);

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
    bumpToFirstPage();
  };

  const handleImport = () => {
    setImportOpen(false);
    bumpToFirstPage();
    refreshCurrentPage();
    Alerts.success('Import complete');
  };

  if (expenseCategories === undefined) return;

  return (
    <>
      <div>
        <div>
          <button onClick={setImportOpen}>+ Add items</button>
          {importOpen && <ImportModal onClose={() => setImportOpen(false)} onCompleteImport={handleImport} />}
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

      <LineItemsTable
        items={items}
        expenseCategories={expenseCategories}
        onItemUpdate={updateItem}
        onItemRemove={deleteItem}
        sortData={sortData}
        setSortData={setSortData}
      />

      <Paginator
        paginationData={paginationData}
        onChange={page => setPaginationData({ ...paginationData, page })}
      />
    </>
  );
}

export default FilterableHistory;
