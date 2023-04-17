import React, { useState } from 'react';
import Modal from 'components/shared/modal';
import FileField from 'components/shared/file_field';
import { LineItems } from 'requests/resources';

const ImportModal = () => {
  const [files, setFiles] = useState([]);


  const submit = () => {
    const formData = new FormData();
    files.forEach((f, idx) => formData.append(`files[]`, f));
    LineItems.upload(formData);
  };

  return (
    <Modal>
      <h2>Add items</h2>

      <FileField onSelect={setFiles} />

      <button onClick={submit}>Submit</button>
    </Modal>
  );
}

export default ImportModal;
