import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/mylib.css';
import axios from 'axios';
import Modal from '../components/Modal';

const MyLib = () => {
  const [activeTab, setActiveTab] = useState('recent'); // 기본 활성 탭
  const [userInfo, setUserInfo] = useState(undefined); // 세션 정보가 로드되지 않았을 때 undefined로 초기화
  const [recentBooks, setRecentBooks] = useState([]); // 최근 읽은 도서 상태
  const [wishlistBooks, setWishlistBooks] = useState([]); // 찜한 도서 상태
  const [completedBooks, setCompletedBooks] = useState([]); // 완독 도서 상태
  const [selectedBook, setSelectedBook] = useState(null); // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 관련 상태
  const [backgroundImage, setBackgroundImage] = useState(''); // 모달 배경 이미지 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 세션 정보를 가져옴
    axios.get('http://localhost:3001/check-session', { withCredentials: true })
      .then(response => {
        setUserInfo(response.data.user); // 세션 정보를 설정
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          // 로그인이 필요하면 로그인 페이지로 이동
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else {
          console.error('세션 정보를 가져오는데 실패했습니다.', error);
        }
      });
  }, [navigate]);

  // 세션 확인 후 처리
  useEffect(() => {
    if (userInfo) {
      // 최근 읽은 도서 데이터를 가져옴
      axios.get('http://localhost:3001/recent-books', { withCredentials: true })
        .then(response => {
          setRecentBooks(response.data); // 서버에서 가져온 데이터를 상태에 저장
        })
        .catch(error => {
          console.error('최근 읽은 도서를 가져오는데 실패했습니다.', error);
        });

      // 찜한 도서 데이터를 가져옴
      axios.get('http://localhost:3001/wishlist-books', { withCredentials: true })
        .then(response => {
          setWishlistBooks(response.data); // 서버에서 가져온 데이터를 상태에 저장
        })
        .catch(error => {
          console.error('찜한 도서를 가져오는데 실패했습니다.', error);
        });

      // 완독 도서 데이터를 가져옴
      axios.get('http://localhost:3001/completed-books', { withCredentials: true })
        .then(response => {
          setCompletedBooks(response.data); // 서버에서 가져온 데이터를 상태에 저장
        })
        .catch(error => {
          console.error('완독 도서를 가져오는데 실패했습니다.', error);
        });
    }
  }, [userInfo]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleBookClick = (book) => {
    navigate(`/detail`, { state: { book } }); // 선택한 책의 전체 객체를 상태로 전달하여 이동
  };  

  const renderContent = () => {
    switch (activeTab) {
      case 'recent':
        return (
          <div className="books-grid">
            {recentBooks.length > 0 ? (
              recentBooks.map((book, index) => (
                <div className="book-card" key={index} >
                  <img src={book.book_cover} alt={`${book.book_name} Cover`} className="mylib-book-cover" />
                  <div className="book-info">
                    <p className="book-title">{book.book_name}</p>
                    <p className="book-author">{book.book_writer}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="mylib-no-readingbooks-message">최근 읽은 도서가 없습니다.</p>
            )}
          </div>
        );
      case 'favorite':
        return (
          <div className="books-grid">
            {wishlistBooks.length > 0 ? (
              wishlistBooks.map((book, index) => (
                <div className="book-card" key={index} onClick={() => handleBookClick(book)}>
                  <img src={book.book_cover} alt={`${book.book_name} Cover`} className="mylib-book-cover" />
                  <div className="book-info">
                    <p className="book-title">{book.book_name}</p>
                    <p className="book-author">{book.book_writer}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="mylib-no-readingbooks-message">찜한 도서가 없습니다.</p>
            )}
          </div>
        );

      case 'bookSignal':
        return (
          <div className="signal-grid">
            <div
              className="signal-card"
              style={{ backgroundImage: `url('/path/to/image1.png')` }}
              onClick={() => handleBookClick('북 시그널 책 제목 1', '/path/to/image1.png')}
            >
              <div className="signal-text">
                <p>시간은 흐르고,<br />우리는 그 속에서 끊임없이 변화한다.</p>
                <p>홍길동, {'<나의 눈부신 친구>'}</p>
              </div>
            </div>
            <div
              className="signal-card"
              style={{ backgroundImage: `url('/path/to/image2.png')` }}
              onClick={() => handleBookClick('북 시그널 책 제목 2', '/path/to/image2.png')}
            >
              <div className="signal-text">
                <p>시간은 흐르고,<br />우리는 그 속에서 끊임없이 변화한다.</p>
                <p>홍길동, {'<나의 눈부신 친구>'}</p>
              </div>
            </div>
            <div
              className="signal-card"
              style={{ backgroundImage: `url('/path/to/image3.png')` }}
              onClick={() => handleBookClick('북 시그널 책 제목 3', '/path/to/image3.png')}
            >
              <div className="signal-text">
                <p>시간은 흐르고,<br />우리는 그 속에서 끊임없이 변화한다.</p>
                <p>홍길동, {'<나의 눈부신 친구>'}</p>
              </div>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className="books-grid">
            {completedBooks.length > 0 ? (
              completedBooks.map((book, index) => (
                <div className="book-card" key={index} onClick={() => handleBookClick(book)}>
                  <img src={book.book_cover} alt={`${book.book_name} Cover`} className="mylib-book-cover" />
                  <div className="book-info">
                    <p className="book-title">{book.book_name}</p>
                    <p className="book-author">{book.book_writer}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="mylib-no-readingbooks-message">완독한 도서가 없습니다.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mylib-container">
      <h1 className="mylib-title">{userInfo?.mem_nick} 님의 서재</h1>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        backgroundImage={backgroundImage}
      >
        <h2>{selectedBook}</h2>
        <p>책 세부 정보 표시</p>
      </Modal>
    </div>
  );
};

export default MyLib;
