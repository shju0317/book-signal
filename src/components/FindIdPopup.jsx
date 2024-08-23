import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../css/popup.css';

const FindIdPopup = ({ memName, memId }) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };
  const handleFindPwRedirect = () => {
    navigate('/findPw'); // 비밀번호 찾기 페이지로 이동
  }

  return (
    <div className="popup-overlay">
      <div className="FindIdPopup">
        <h4>아이디 찾기</h4>
        <FaCheckCircle className = "popup-FindIdcomplete" size={50} />
        <p>{memName} 님의 아이디는</p>
        <h3>{memId} 입니다.</h3>
        <button className="popup-button" onClick={handleLoginRedirect}>로그인</button>
        <button className="popup-FindPwbutton" onClick={handleFindPwRedirect}>비밀번호 찾기</button>
      </div>
    </div>
  );
};

export default FindIdPopup;
