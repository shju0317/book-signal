import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import '../css/findid.css'; // 스타일 시트 연결

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>아이디 찾기</h2>
        <FaTimesCircle className="popup-Error" color="red" size={50} />
        <p>{message}</p>
        <button className="popup-button" onClick={onClose}>확인</button>
      </div>
    </div>
  );
};

export default ErrorPopup;