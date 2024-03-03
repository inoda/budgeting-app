import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.className += ' modal-open';

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") onClose();
    });

    return () => {
      document.body.className = document.body.className.replace('modal-open', '');
      document.removeEventListener("keydown", onClose);
    }
  }, [])

  return (
    <div className="modal-mask modal">
      <div className="modal-wrapper">
        <div className="modal-container">
          <div className="modal-header">
            <a onClick={onClose}>
              <FontAwesomeIcon icon={faClose} />
            </a>
          </div>

          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
