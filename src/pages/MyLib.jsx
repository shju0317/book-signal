import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/mylib.css';
import axios from 'axios';

const MyLib = () => {
  const [activeTab, setActiveTab] = useState('recent'); // 기본 활성 탭
  const [userInfo, setUserInfo] = useState(undefined); // 초기값을 undefined로 설정
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 세션 정보를 가져옴
    axios.get('http://localhost:3001/check-session', { withCredentials: true })
      .then(response => {
        if (response.data.user) {
          setUserInfo(response.data.user);  // 사용자 정보가 있으면 저장
        } else {
          setUserInfo(null);  // 사용자 정보가 없으면 null로 설정
        }
      })
      .catch(error => {
        console.error('세션 정보를 가져오는데 실패했습니다.', error);
        setUserInfo(null);  // 에러 발생 시 null로 설정
      });
  }, []);

  useEffect(() => {
    if (userInfo === null) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 이동
    }
  }, [userInfo, navigate]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    if (userInfo === undefined) {
      return <div>로딩 중...</div>;  // userInfo가 undefined일 때 로딩 메시지 표시
    }

    switch (activeTab) {
      case 'recent':
        return (
          <div className="books-grid">
            <div className="book-card">
              <img src="" alt="Book Cover" className="book-cover" />
              <div className="book-info">
                <p className="book-title">&lt;최근 읽은 책 제목&gt;</p>
                <p className="book-author">저자 이름</p>
              </div>
            </div>
          </div>
        );
      case 'favorite':
        return (
          <div className="books-grid">
            <div className="book-card">
              <img src="" alt="Book Cover" className="book-cover" />
              <div className="book-info">
                <p className="book-title">&lt;찜한 책 제목&gt;</p>
                <p className="book-author">저자 이름</p>
              </div>
              <div className="book-heart">❤️</div>
            </div>
          </div>
        );
      case 'bookSignal':
        return (
          <div className="books-grid">
            <div className="book-card">
              <img src="" alt="Book Cover" className="book-cover" />
              <div className="book-info">
                <p className="book-title">&lt;북 시그널 책 제목&gt;</p>
                <p className="book-author">저자 이름</p>
              </div>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className="books-grid">
            <div className="book-card">
              <img src="" alt="Book Cover" className="book-cover" />
              <div className="book-info">
                <p className="book-title">&lt;완독한 책 제목&gt;</p>
                <p className="book-author">저자 이름</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mylib-container">
      {userInfo && <h1 className="mylib-title">{userInfo.mem_nick} 님의 서재</h1>}
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

      {renderContent()}
    </div>
  );
};

export default MyLib;
