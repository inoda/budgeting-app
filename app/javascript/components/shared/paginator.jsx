import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons'

export const STARTING_STATE = {
  page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 0
}

const Paginator = ({ paginationData, onChange }) => {
  const {
    page,
    per_page: perPage,
    total_pages: totalPages,
    total_items: totalItems,
  } = paginationData;

  const nextPage = () => {
    if (page + 1 > totalPages) return;
    onChange(page + 1);
  }

  const prevPage = () => {
    if (page - 1 < 1) return;
    onChange(page - 1);
  }

  const displayedPages = useMemo(() => {
    const pages = [];
    let lowerBound = 0;
    let upperBound = 0;

    if (totalPages <= 10) {
      lowerBound = 1;
      upperBound = totalPages;
    } else {
      // Make sure if we're on the last page, and there are enough previous pages, we still show 10 pages total up to the last page
      const nextSlidingLowerBound = page >= totalPages - 4 ? totalPages - 9 : page - 5;
      lowerBound = page >= 10 ? nextSlidingLowerBound : 1;

      // Make sure the next upper bound isn't outside of the range of pages available
      const nextSlidingUpperBound = page + 4 > totalPages ? totalPages : page + 4;
      upperBound = page >= 10 ? nextSlidingUpperBound : 10;
    }

    for (let p = lowerBound; p <= upperBound; p++) { pages.push(p); }
    return pages;
  }, [page, totalPages]);

  const itemsLowerLimit = useMemo(() => {
    if (page === 1) return 1;
    return ((page - 1) * perPage) + 1;
  }, [page, perPage]);

  const itemsUpperLimit = useMemo(() => {
    const upperLimit = page * perPage;
    return Math.min(totalItems, upperLimit);
  }, [page, perPage, totalItems]);

  if (totalItems < 1) return;

  return (
    <div className="paginator">
      <div>
        Showing <b>{itemsLowerLimit}</b>-<b>{itemsUpperLimit}</b> of <b>{totalItems}</b>
      </div>

      <ol>
        <li>
          <a onClick={prevPage}><FontAwesomeIcon icon={faAngleDoubleLeft} /></a>
        </li>
        {displayedPages.map((p) =>
          <li key={`page-${p}`} className={`${page == p ? 'active' : ''}`}>
            <a onClick={() => onChange(p)}>{p}</a>
          </li>
        )}
        <li>
          <a onClick={nextPage}><FontAwesomeIcon icon={faAngleDoubleRight} /></a>
        </li>
      </ol>
    </div>
  );
}

export default Paginator;
