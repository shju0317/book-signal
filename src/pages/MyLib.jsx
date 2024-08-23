import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/mylib.css';
import axios from 'axios';

const MyLib = () => {
  const [activeTab, setActiveTab] = useState('recent'); // 기본 활성 탭
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 세션 정보를 가져옴
    axios.get('http://localhost:3001/check-session', { withCredentials: true })
      .then(response => {
        setUserInfo(response.data.user);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login'); // 로그인 페이지로 이동
        } else {
          console.error('세션 정보를 가져오는데 실패했습니다.', error);
        }
      });
  }, [navigate]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  if (!userInfo) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="mylib-container">
      <h1 className="mylib-title">{userInfo.mem_nick} 님의 서재</h1>
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => handleTabClick('recent')}
        >
          최근 읽은 도서
        </div>
        <div
          className={`tab ${activeTab === 'favorite' ? 'active' : ''}`}
          onClick={() => handleTabClick('favorite')}
        >
          찜한 도서
        </div>
        <div
          className={`tab ${activeTab === 'bookSignal' ? 'active' : ''}`}
          onClick={() => handleTabClick('bookSignal')}
        >
          북 시그널
        </div>
        <div
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => handleTabClick('completed')}
        >
          완독 도서
        </div>
      </div>

      <div className="books-grid">
        {/* 책 카드 예시 */}
        <div className="book-card">
          <img src="" alt="Book Cover" className="book-cover" />
          <div className="book-info">
            <p className="book-title">&lt;나의 눈부신 친구&gt;</p>
            <p className="book-author">히가시노 게이고</p>
          </div>
          <div className="book-heart">❤️</div>
        </div>
        {/* 다른 책 카드들... */}
      </div>
    </div>
  );
};

export default MyLib;
