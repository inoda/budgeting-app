import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faSort } from '@fortawesome/free-solid-svg-icons'

const Table = ({ columnConfig, idFunc, items, sortData, onSortChange }) => {
  const maybeSortableHeader = (c) => {
    if (!c.sortable) return c.header;

    if (sortData.sort === c.key) {
      return (
        <a onClick={() => onSortChange({ sort: c.key, sortDesc: !sortData.sortDesc })}>
          {c.header} <FontAwesomeIcon icon={sortData.sortDesc ? faCaretDown : faCaretUp} style={{ marginLeft: '2px' }} />
        </a>
      );
    }

    return (
      <a onClick={() => onSortChange({ sort: c.key, sortDesc: true })}>
        {c.header} <FontAwesomeIcon color="rgba(0, 0, 0, 0.2)" icon={faSort} style={{ marginLeft: '2px' }} />
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
            <tr key={i.id || idFunc(i)}>
              {columnConfig.map(c =>
                <td key={c.key} style={c.width ? { width: c.width } : {}}>
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
