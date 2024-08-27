import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/bookDetail.css';
import { IoMdHeartEmpty } from "react-icons/io";
import { TiStarFullOutline } from "react-icons/ti";

const BookDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { book } = location.state || {};
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memId, setMemId] = useState(null); // 사용자 ID 상태 추가

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로그인 상태 확인
    axios.get('http://localhost:3001/check-session', { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          setIsLoggedIn(true);
          setMemId(response.data.user.mem_id); // 사용자 ID 설정
          // 찜한 상태 확인
          checkWishlistStatus(response.data.user.mem_id, book.book_idx);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(error => {
        console.error('로그인 상태 확인 중 오류 발생:', error);
        setIsLoggedIn(false);
      });
  }, [book.book_idx]);

  // 사용자가 이미 찜한 도서인지 확인
  const checkWishlistStatus = async (memId, bookIdx) => {
    try {
      const response = await axios.post('http://localhost:3001/wishlist/check', { mem_id: memId, book_idx: bookIdx });
      setIsWishlisted(response.data.isWishlisted);
    } catch (error) {
      console.error('찜한 도서 상태 확인 실패:', error);
    }
  };

  const handleWishList = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await axios.post('http://localhost:3001/wishlist/remove', { mem_id: memId, book_idx: book.book_idx });
        alert('찜한 도서에서 제거되었습니다.');
      } else {
        await axios.post('http://localhost:3001/wishlist', { mem_id: memId, book_idx: book.book_idx });
        alert('찜한 도서에 추가되었습니다.');
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('찜한 도서 처리 실패:', error);
    }
  };

  const handleReadBook = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const bookNameWithoutSpaces = book.book_name.replace(/\s+/g, '');

    try {
      const response = await axios.post('http://localhost:3001/getBookPath', {
        book_name: encodeURIComponent(bookNameWithoutSpaces)
      });

      const bookPath = response.data.book_path;
      navigate('/reader', { state: { bookPath } });
    } catch (error) {
      console.error('책 경로를 가져오는 중 오류 발생:', error);
      alert('책 경로를 가져오지 못했습니다.');
    }
  };

  return (
    <div className='book-info-wrapper flex flex-col gap-10 max-w-screen-xl m-auto'>
      <section className='flex gap-6 w-30 justify-between'>
        <h2 className='sr-only'>도서 정보</h2>
        <div className='book-cover-wrapper w-[250px] aspect-w-2 aspect-h-3'>
          <img src={book?.book_cover} alt={book?.book_name || "도서 이미지"} className='w-full h-full object-cover rounded-xl' />
        </div>
        <div className='border rounded-xl grow flex flex-col justify-between'>
          <div className='book-info-contents flex flex-col gap-2 text-md p-6'>
            <p>{book.book_genre}</p>
            <p className='text-3xl font-semibold mb-4'>{book.book_name}</p>
            <div className='flex gap-3'>
              <p>{book?.book_writer}<span>저자</span></p>
            </div>
            <p className='mb-4'>{book.book_published_at}<span>출간</span></p>
            <div className='flex ml-[-6px]'>
              <span className='mr-2'>이 책을 읽은 독자</span>{book.book_views}
              <p className='flex ml-3 items-center'>
                <span className='sr-only'>평점</span>
                <TiStarFullOutline />
                <strong className='ml-1'>{book.book_avg}</strong>
              </p>
            </div>
          </div>
          <div className='book-info-button flex'>
            <button onClick={handleReadBook} className='border-t border-r rounded-bl-xl flex-1 text-primary'>바로 읽기</button>
            <button onClick={handleWishList} className={`border-t flex items-center justify-center rounded-br-xl flex-1 ${isWishlisted ? 'bg-primary text-white' : 'text-primary'}`}>
              <IoMdHeartEmpty size={22} className='mr-2' />내 서재에 찜하기
            </button>
          </div>
        </div>
      </section>
      <section>
        <h2 className='text-2xl'>책 소개</h2>
        <div className='bg-background p-6 mt-3 rounded-xl'>
          <h3 className='text-xl mb-3'>요약</h3>
          <p className='font-normal'>{book.book_explanation}</p>
        </div>
      </section>
      <section>
        <h2 className='text-2xl mb-3'>관련 도서</h2>
        <div className='flex gap-4'>
          <div className='book-cover-wrapper w-[200px]'>
            <img src='book_cover_sample.jpg' alt="이미지" className='w-full h-full rounded-xl' />
          </div>
          <div className='book-cover-wrapper w-[200px] aspect-w-2 aspect-h-3'>
            <img src='book_cover_sample.jpg' alt="이미지" className='w-full h-full rounded-xl object-cover' />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookDetail;
