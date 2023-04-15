import React, { useState, useEffect } from 'react';
import { LineItems } from 'requests/resources';
import Paginator, { STARTING_STATE } from 'components/shared/paginator';
import Table from 'components/shared/table';
import CreateModal from './create_modal';
import moment from 'moment';

const List = () => {
  const [items, setItems] = useState([]);
  const [paginationData, setPaginationData] = useState(STARTING_STATE);
  const [sortData, setSortData] = useState({ sort: 'transaction_date', sortDesc: true });
  const [search, setSearch] = useState('');
  const [addItemOpen, setAddItemOpen] = useState(false);

  useEffect(() => {
    LineItems.paginatedList({ ...sortData, search, includeCategory: true }, paginationData).then(
      (resp) => {
        setItems(resp.items);
        setPaginationData(resp.pagination_data);
      },
      () => { console.error('TODO') },
    );
  }, [paginationData.page, JSON.stringify(sortData), search])

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
      render: (item) => { return <button>x</button> },
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
          <input placeholder="Search memo or category" onChange={e => setSearch(e.target.value)} />
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
