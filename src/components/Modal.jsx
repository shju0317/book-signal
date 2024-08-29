import React from 'react';
import '../css/modal.css';

const Modal = ({ isOpen, onClose, onDownload, backgroundImage, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          backgroundImage: `url(${backgroundImage}) `, 
          backgroundSize:  'cover',
          backgroundPosition: 'center',
        }}
      >
        <button className="modal-download" onClick={onDownload}>↓</button>
        <button className="modal-close" onClick={onClose}>X</button>
        <div className="modal-text">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
