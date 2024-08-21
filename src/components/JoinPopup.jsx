import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import '../css/popup.css'; // 팝업 CSS

const Popup = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>{message}</h3>
        <FaCheckCircle className='popup-joinComplete' color= "green" size={40} />
        <button onClick={onButtonClick} className="popup-button">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Popup;