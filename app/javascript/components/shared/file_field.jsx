import React from 'react';
import Dropzone from 'react-dropzone'

const FileField = ({ onSelect }) => {
  return (
    <Dropzone onDrop={onSelect} accept={{ "text/csv": [] }} useFsAccessApi={false}>
      {({ getRootProps, getInputProps }) => (
        <section className="dropzone">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p style={{ width: '100% '}}>Drag or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default FileField;
