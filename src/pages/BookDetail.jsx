import React from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../css/bookDetail.css';
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegStar } from "react-icons/fa6";

const BookDetail = () => {
  const location = useLocation();
  const { book } = location.state || {}; // 상태에서 도서 정보 받기
  // console.log('book!!!', book);

  // 찜하기
  const handleWishList = async () => {
    try {
      await axios.post('/wishlist', { mem_id: "test", book_idx: book.book_idx });
      alert('찜한 도서에 추가되었습니다.');
    } catch (error) {
      console.error('찜한 도서 추가 실패:', error);
    }
  };

  return (
    <div className='book-info-wrapper flex flex-col gap-10 max-w-screen-xl m-auto'>
      <section className='flex gap-6 w-30 justify-between'>
        <h2 className='sr-only'>도서 정보</h2>
        <div className='book-cover-wrapper w-[250px] aspect-w-2 aspect-h-3'>
          <img src={book?.book_cover} alt={book?.book_name || "도서 이미지"} className='w-full h-full object-cover rounded-xl'/>
        </div>
        <div className='border rounded-xl grow flex flex-col justify-between'>
          <div className='book-info-contents flex flex-col gap-2 text-md p-6'>
            <p>{book.book_genre}</p>
            {/* <p className='text-3xl font-semibold mb-4'>나의 눈부신 친구</p> */}
            <p className='text-3xl font-semibold mb-4'>{book.book_name}</p>
            <div className='flex gap-3'>
              <p>{book?.book_writer}<span>저자</span></p>
              {/* <p className='before:content-["|"] before:mr-3'>홍길순<span>옮김</span></p> */}
            </div>
            <p className='mb-4'>{book.book_published_at}<span>출간</span></p>
            <div className='flex ml-[-6px]'>
              <span className='mr-2'>이 책을 읽은 독자</span>{book.book_views}
              <p className='flex ml-3 items-center'>
                <span className='sr-only'>평점</span>
                <FaRegStar />
                <strong className='ml-1'>4.5</strong>
              </p>
            </div>
          </div>
          <div className='book-info-button flex'>
            <button className='border-t border-r rounded-bl-xl flex-1'>바로 읽기</button>
            <button onClick={handleWishList} className='border-t flex items-center justify-center rounded-br-xl flex-1'><IoMdHeartEmpty size={22} className='mr-2'/>내 서재에 찜하기</button>
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
            <img src='book_cover_sample.jpg' alt="이미지" className='w-full h-full rounded-xl'/>
          </div>
          <div className='book-cover-wrapper w-[200px] aspect-w-2 aspect-h-3'>
            <img src='book_cover_sample.jpg' alt="이미지" className='w-full h-full rounded-xl object-cover'/>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookDetail