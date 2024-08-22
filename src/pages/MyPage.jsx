import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/mypage.css';
import { VscPreview } from "react-icons/vsc";
import { BsPersonCircle } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { PiHandCoinsDuotone } from "react-icons/pi";
import axios from 'axios';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 세션 정보를 가져옴
    axios.get('http://localhost:3001/check-session', { withCredentials: true })
      .then(response => {
        setUserInfo(response.data.user);
      })
      .catch(error => {
        if (error.response.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login'); // 로그인 페이지로 이동
        } else {
          console.error('세션 정보를 가져오는데 실패했습니다.', error);
        }
      });
  }, [navigate]);

  const handleDeleteUser = () => {
    navigate('/deleteuser'); // 회원탈퇴 페이지로 이동
  };

  if (!userInfo) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="mypage-container">
      <div className="user-info">
        <h2>{userInfo.mem_nick} 님</h2>
        <br />
        <div className='info-group'>
          <BsPersonCircle className='icon' />
          <p>아이디: {userInfo.mem_id}</p>
        </div>
        <br />
        <div className='info-group'>
          <MdEmail className='icon' />
          <p>이메일: {userInfo.email}</p>
        </div>
        <br />
        <div className='info-group'>
          <PiHandCoinsDuotone className='icon' />
          <p>포인트: <span className="points">{userInfo.point}</span>점</p>
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
