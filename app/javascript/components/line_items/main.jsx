import React, { useState, useEffect } from 'react';
import { LineItems, ExpenseCategories } from 'requests/resources';
import Paginator, { STARTING_STATE } from 'components/shared/paginator';
import LineItemsTable from './table';
import ImportModal from './import_modal';
import DatePicker from 'react-datepicker';
import { Alerts, Debounce } from 'utilities/main';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const Main = () => {
  const [items, setItems] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState(undefined);
  const [paginationData, setPaginationData] = useState(STARTING_STATE);
  const [sortData, setSortData] = useState({ sort: 'transaction_date', sortDesc: true });
  const [search, setSearch] = useState('');
  const changeSearch = Debounce.call(setSearch, 500);
  const [transactionDateMin, setTransactionDateMin] = useState(moment().subtract(90, 'days').toDate());
  const [transactionDateMax, setTransactionDateMax] = useState(moment().add(1, 'day').toDate());
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

  const handleImport = () => {
    setImportOpen(false);
    bumpToFirstPage();
    refreshCurrentPage();
    Alerts.success('Import complete');
  };

  if (expenseCategories === undefined) return;

  return (
    <>
      <div className="flex-row space-between">
        <div className="flex-row">
          <div className="input-with-icon" style={{ width: "300px" }}>
            <input placeholder="Search memo or category" onChange={e => changeSearch(e.target.value)} />
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <div>
            <DatePicker
              selected={transactionDateMin}
              onChange={setTransactionDateMin}
              placeholderText="Start date"
            />
          </div>
          <div>
            <DatePicker
              selected={transactionDateMax}
              onChange={setTransactionDateMax}
              placeholderText="End date"
            />
          </div>
        </div>

        <div>
          <button onClick={setImportOpen}>Import</button>
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

      {importOpen && <ImportModal onClose={() => setImportOpen(false)} onCompleteImport={handleImport} />}
    </>
  );
}

export default Main;
