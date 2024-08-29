import React from 'react';
import '../css/modal.css';
import { FaArrowDown } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const Modal = ({ isOpen, onClose, onDownload, backgroundImage, children }) => {
  console.log(backgroundImage);
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className='modal-polaroid'>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            backgroundImage: `url('${backgroundImage}')`, 
            backgroundSize:  'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <button className="modal-download" onClick={onDownload}><FaArrowDown /></button>
          <button className="modal-close" onClick={onClose}><RxCross2 /></button>
          <div className="modal-text ">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
