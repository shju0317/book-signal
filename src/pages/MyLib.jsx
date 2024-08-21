import React, { useState } from 'react';
import '../css/mylib.css';

const MyLib = () => {
  const [activeTab, setActiveTab] = useState('recent'); // 기본 활성 탭

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="mylib-container">
      <h1 className="mylib-title">바나나 알러지 원숭이 님의 서재</h1>
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
