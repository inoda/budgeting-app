import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'components/shared/modal';
import FileField from 'components/shared/file_field';
import LineItemsTable from './table';
import { LineItems, ExpenseCategories } from 'requests/resources';
import { Alerts } from 'utilities/main';

const ImportModal = ({ onClose, onCompleteImport }) => {
  const [items, setItems] = useState([]);
  const [filesUploaded, setFilesUploaded] = useState(false);
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
        setFilesUploaded(true);
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
    <Modal onClose={onClose}>
      {(!filesUploaded || (filesUploaded && items.length === 0)) && (
        <>
          <div className="form-row">
            <FileField onSelect={importFiles} />
          </div>

          {filesUploaded && Alerts.warn("Nothing to import")}
        </>
      )}

      {filesUploaded && items.length > 0 && (
        <>
          <LineItemsTable
            expenseCategories={expenseCategories}
            items={items}
            onItemUpdate={updateItem}
            onItemRemove={removeItem}
          />

          <button disabled={loading} onClick={submit}>Import {items.length} items</button>
        </>
      )}
    </Modal>
  );
}

export default ImportModal;
