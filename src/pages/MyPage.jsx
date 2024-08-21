import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/mypage.css';
import { VscPreview } from "react-icons/vsc";
import { BsPersonCircle } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { PiHandCoinsDuotone } from "react-icons/pi";

const MyPage = () => {

  const navigate = useNavigate();

  const handleDeleteUser = () => {
    navigate('/deleteuser'); // 회원탈퇴 페이지로 이동
  };

  return (
    <div className="mypage-container">
      <div className="user-info">
        <h2>바나나알러지원숭이 님</h2>
        <br />
        <div className='info-group'>
          <BsPersonCircle className='icon' />
          <p>아이디: banana_03</p>
        </div>
        <br />
        <div className='info-group'>
          <MdEmail className='icon' />
          <p>이메일: example@naver.com</p>
        </div>
        <br />
        <div className='info-group'>
          <PiHandCoinsDuotone className='icon' />
          <p>포인트: <span className="points">1,500</span>점</p>
        </div>
        <br />
        <button onClick={handleDeleteUser}>회원탈퇴</button>
      </div>
      <div className="review-section">
        <h3>내가 작성한 리뷰</h3>
        <br />
        <div className="review-placeholder">
          <VscPreview className="preview-icon" />
          <br />
          <p>아직 작성된 리뷰가 없어요</p>
          <p>책을 읽고 리뷰를 작성해 포인트를 쌓아보세요!</p>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
