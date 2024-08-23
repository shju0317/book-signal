import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../css/popup.css'; // 팝업 스타일 시트

// 비밀번호 설정 완료 팝업
const NewPwPopup = () => {
    const navigate = useNavigate();
  
    const handleLoginRedirect = () => {
      navigate('/login'); // 로그인 페이지로 이동
    };
  
  
    return (
      <div className="popup-overlay">
        <div className="NewPwPopup">
          <h4>비밀번호 재설정 완료</h4>
          <FaCheckCircle className = "popup-pwResetComplete" size={50} />
          <button className="popup-button" onClick={handleLoginRedirect}>로그인</button>
        </div>
      </div>
    );
  };

  export default NewPwPopup;