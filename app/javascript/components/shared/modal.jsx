import React from 'react';

const Modal = ({ children }) => {
  return (
    <div style={{ border: '1px solid red', padding: '20px' }}>
      {children}
    </div>
  );
}

export default Modal;
