import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import '../css/popup.css';

// 아이디 찾기 오류 팝업
const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="Error-findIdPopup">
        <h2>아이디 찾기</h2>
        <FaTimesCircle className="popup-Error" color="red" size={50} />
        <p className='Error-massage'>{message}</p>
        <button className="popup-button" onClick={onClose}>확인</button>
      </div>
    </div>
  );
};

// 비밀번호 찾기 오류 팝업
const ErrorPopupPw = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="Error-FindPwPopup">
        <h2>비밀번호 찾기</h2>
        <FaTimesCircle className="popup-Error" color="red" size={50} />
        <p className='Error-massage'>{message}</p>
        <button className="popup-button" onClick={onClose}>확인</button>
      </div>
    </div>
  );
};



export { ErrorPopup, ErrorPopupPw };

  
