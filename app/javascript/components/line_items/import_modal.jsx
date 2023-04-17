import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'components/shared/modal';
import FileField from 'components/shared/file_field';
import LineItemsTable from './table';
import { LineItems, ExpenseCategories } from 'requests/resources';
import { Alerts } from 'utilities/main';

const ImportModal = ({ onClose, onCompleteImport }) => {
  const [items, setItems] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ExpenseCategories.list().then(setExpenseCategories, Alerts.genericError);
  }, []);

  const importFiles = (files) => {
    const formData = new FormData();
    files.forEach(f => formData.append(`files[]`, f));

    setLoading(true);

    LineItems.upload(formData).then(
      (resp) => {
        setItems(resp);
        setShowPreview(true);
        setLoading(false);
      },
      () => {
        Alerts.genericError();
        setLoading(false);
      },
    );
  };

  const idsToIndex = useMemo(() => {
    const map = {};
    items.forEach((i, idx) => map[i.id] = idx);
    return map;
  }, [items])

  const removeItem = (id) => {
    const modifiedList = [...items]; // Make a copy
    const idx = idsToIndex[id];
    modifiedList.splice(idx, 1);
    setItems(modifiedList);
  }

  const updateItem = (id, updates) => {
    const modifiedList = [...items]; // Make a copy
    const idx = idsToIndex[id]
    const modifiedItem = Object.assign({ ...modifiedList[idx] }, updates);
    modifiedList[idx] = modifiedItem;
    setItems(modifiedList);
  }

  const submit = () => {
    setLoading(true);

    LineItems.bulkCreate({ lineItems: items }).then(
      () => {
        setLoading(false);
        onCompleteImport();
      },
      () => {
        setLoading(false);
        Alerts.genericError();
      },
    );
  }

  if (expenseCategories === undefined) return;

  return (
    <Modal>
      {!showPreview && (
        <>
          <h2>Add items</h2>
          <FileField onSelect={importFiles} />

          <button onClick={onClose}>Cancel</button>
        </>
      )}

      {showPreview && items.length === 0 && (
        <>
          <h2>Nothing to import</h2>
          <button disabled={loading} onClick={() => setShowPreview(false)}>Back</button>
        </>
      )}

      {showPreview && items.length > 0 && (
        <>
          <h2>Review import ({ items.length } items)</h2>
          <LineItemsTable
            expenseCategories={expenseCategories}
            items={items}
            onItemUpdate={updateItem}
            onItemRemove={removeItem}
          />

          <div>
            <button disabled={loading} onClick={submit}>Submit</button>
            <button disabled={loading} onClick={() => setShowPreview(false)}>Cancel</button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default ImportModal;
