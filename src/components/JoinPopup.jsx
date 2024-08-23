import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import '../css/popup.css';

const JoinPopup = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className="popup-overlay">
      <div className="JoinPopup">
        <h3>{message}</h3>
        <FaCheckCircle className='popup-joinComplete' size={50} />
        <button onClick={onButtonClick} className="popup-button">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default JoinPopup;