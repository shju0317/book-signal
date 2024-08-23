import React, { useState } from 'react';
import '../css/mylib.css';

const MyLib = () => {
  const [activeTab, setActiveTab] = useState('recent'); // 기본 활성 탭

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
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
              <div className="book-heart">❤️</div>
            </div>
            {/* 다른 최근 읽은 책 카드들... */}
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
            {/* 다른 찜한 책 카드들... */}
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
              <div className="book-heart">❤️</div>
            </div>
            {/* 다른 북 시그널 책 카드들... */}
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
              <div className="book-heart">❤️</div>
            </div>
            {/* 다른 완독 도서 카드들... */}
          </div>
        );
      default:
        return null;
    }
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

      {renderContent()}
      
    </div>
  );
};

export default MyLib;
