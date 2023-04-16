import React from 'react';

const Table = ({ columnConfig, items, sortData, onSortChange }) => {
  const maybeSortableHeader = (c) => {
    if (!c.sortable) return c.header;

    if (sortData.sort === c.key) {
      return (
        <a onClick={() => onSortChange({ sort: c.key, sortDesc: !sortData.sortDesc })}>
          {c.header} [{sortData.sortDesc ? '▼' : '▲'}]
        </a>
      );
    }

    return (
      <a onClick={() => onSortChange({ sort: c.key, sortDesc: true })}>
        {c.header} [ ]
      </a>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          {columnConfig.map(c => <th key={c.key}>{maybeSortableHeader(c)}</th>)}
        </tr>
      </thead>

      <tbody>
        {items.map((i => {
          return (
            <tr key={i.id}>
              {columnConfig.map(c =>
                <td key={c.key}>
                  {c.render ? c.render(i) : i[c.key]}
                </td>
              )}
            </tr>
          )
        }))}
      </tbody>
    </table>
  );
}

export default Table;
