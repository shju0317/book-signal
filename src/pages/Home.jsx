import React from 'react';
import SlideShow from '../components/SlideShow';
import { Link, useNavigate } from 'react-router-dom';
import '../css/fonts.css';
import '../css/main.css';


const slides = [
  {
    title: "나의 눈부신 친구",
    description: "곱추린 듯 다음 페이지를 넘기고 싶은 이야기. 그러나 결코 끝나지 않기를 바라는 이야기",
    image: "",
    background: "linear-gradient(to right, #637582, #7393B3)" // 감각적인 뮤트톤의 블루 그라데이션
  },
  {
    title: "다른 슬라이드 제목 2",
    description: "다른 슬라이드 설명 1",
    image: "",
    background: "linear-gradient(to right, #D8A7B1, #E4B9C0)" // 뮤트톤의 더스티 핑크
  },
  {
    title: "다른 슬라이드 제목 3",
    description: "다른 슬라이드 설명 2",
    image: "",
    background: "linear-gradient(to right, #B2BEB5, #A4C3B2)" // 뮤트톤의 세이지 그린
  },
  {
    title: "다른 슬라이드 제목 4",
    description: "다른 슬라이드 설명 3",
    image: "",
    background: "linear-gradient(to right, #C1A78B, #A68972)" // 뮤트톤의 샌드 베이지
  },
  {
    title: "다른 슬라이드 제목 5",
    description: "다른 슬라이드 설명 4",
    image: "",
    background: "linear-gradient(to right, #B6A5C9, #C3A3B5)" // 뮤트톤의 라벤더 그레이
  }
];


// 인기
const bookBest = [
  { title: '제목1', author: '저자/옮긴이', image: '' },
  { title: '제목2', author: '저자/옮긴이', image: '' },
  { title: '제목3', author: '저자/옮긴이', image: '' },
  { title: '제목4', author: '저자/옮긴이', image: '' },
  { title: '제목5', author: '저자/옮긴이', image: '' }
];


// 평점
const reviewBest = [
  { title: '제목1', author: '저자/옮긴이', image: '' },
  { title: '제목2', author: '저자/옮긴이', image: '' },
  { title: '제목3', author: '저자/옮긴이', image: '' },
  { title: '제목4', author: '저자/옮긴이', image: '' },
  { title: '제목5', author: '저자/옮긴이', image: '' }
];

// 신작
const newBook = [
  { title: '제목1', author: '저자/옮긴이', image: '' },
  { title: '제목2', author: '저자/옮긴이', image: '' },
  { title: '제목3', author: '저자/옮긴이', image: '' },
  { title: '제목4', author: '저자/옮긴이', image: '' },
  { title: '제목5', author: '저자/옮긴이', image: '' }
];

// 최근읽은
const readNow = [
  { title: '제목1', author: '저자/옮긴이', image: '' },
  { title: '제목2', author: '저자/옮긴이', image: '' },
  { title: '제목3', author: '저자/옮긴이', image: '' },
  { title: '제목4', author: '저자/옮긴이', image: '' },
  { title: '제목5', author: '저자/옮긴이', image: '' }
];

// 추천시그널
const signal = [
  { title: '제목1', gpt: '지피티추천', image: '' },
  { title: '제목2', gpt: '지피티추천', image: '' },
  { title: '제목3', gpt: '지피티추천sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', image: '' },
];


const Home = () => {
  return (
    <div className='max-w-screen-xl mx-auto' style={{ maxWidth: '1280px' }}>
      {/* 슬라이드 */}
      <br />
      <SlideShow slides={slides} />
      <br />

      <h2 className='flex justify-between items-end mt-6 mb-0'>
        지금, 많이 읽은 그 작품
        <Link to="/rankingBookList" className="text-sm text-gray-400">
          더보기
        </Link>
      </h2>
      {/* 인기top5 */}
      <div >
        <br />
        <div className='flex justify-between p-1.5'>
          {bookBest.map((book, index) => (
            <div key={index} className="rounded-lg shadow-lg hover:transform hover:-translate-y-2 transition-transform duration-300" style={{ width: '220px', height: '300px' }}>
              <img src={book.image} alt={`${book.title} Cover`} className="book-cover" />
              <div className="book-info">
                <p className="book-title">&lt;{book.title}&gt;</p>
                <p className="book-author">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />

      {/* 평점 top5 */}
      <h2 className='flex justify-between items-end mt-6 mb-0'>
        평점, BEST!
        <Link to="/rankingBookList" className="text-sm text-gray-400">
          더보기
        </Link>
      </h2>
      <div>
        <br />
        <div className='flex justify-between p-1.5'>
          {reviewBest.map((book, index) => (
            <div key={index} className="rounded-lg shadow-lg hover:transform hover:-translate-y-2 transition-transform duration-300" style={{ width: '230px', height: '330px' }}>
              <img src={book.image} alt={`${book.title} Cover`} className="book-cover" />
              <div className="book-info">
                <p className="book-title">&lt;{book.title}&gt;</p>
                <p className="book-author">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />


      {/* 신작 top5 */}
      <h2 className='flex justify-between items-end mt-6 mb-0'>
        갓 나온 신작
        <Link to="/rankingBookList" className="text-sm text-gray-400">
          더보기
        </Link>
      </h2>
      <div>
        <br />
        <div className='flex justify-between p-1.5'>
          {newBook.map((book, index) => (
            <div key={index} className="rounded-lg shadow-lg hover:transform hover:-translate-y-2 transition-transform duration-300" style={{ width: '230px', height: '330px' }}>
              <img src={book.image} alt={`${book.title} Cover`} className="book-cover" />
              <div className="book-info">
                <p className="book-title">&lt;{book.title}&gt;</p>
                <p className="book-author">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />

      {/* 최근읽은 도서 */}
      <h2 className='flex justify-between items-end mt-6 mb-0'>
        최근 읽은 도서
        <Link to="/mylib" className="text-sm text-gray-400">
          더보기
        </Link>
      </h2>
      <div>
        <br />
        <div className='flex justify-between p-1.5'>
          {readNow.map((book, index) => (
            <div key={index} className="rounded-lg shadow-lg hover:transform hover:-translate-y-2 transition-transform duration-300" style={{ width: '230px', height: '330px' }}>
              <img src={book.image} alt={`${book.title} Cover`} className="book-cover" />
              <div className="book-info">
                <p className="book-title">&lt;{book.title}&gt;</p>
                <p className="book-author">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />

      {/* 추천시그널 */}
      <h2 className='flex justify-between items-end mt-6 mb-0'>
        닉네임 님에게 보내는 추천 시그널
      </h2>
      <br />
      <div className="bg-[#FCF4EF] h-auto pt-3 pb-5 rounded-xl">
        <br />
        <div className='flex justify-center gap-4 max-w-5xl mx-auto'>
          {signal.map((book, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center hover:transform hover:-translate-y-2 transition-transform duration-300"
              style={{ width: '380px' }}
            >
              {/* 사진 */}
              <img
                src={book.image}
                alt={`${book.title} Cover`}
                className="z-20 rounded-lg shadow-lg"
                style={{ width: '230px', height: '310px' }}
              />

              {/* 텍스트 박스 */}
              <div className="opacity-75 relative z-10 -mt-7 w-[300px] h-auto min-h-44 max-h-48 bg-white p-4 rounded-lg shadow-lg text-center break-words">
                <p className="font-semibold text-lg pt-6 pb-2">&lt;{book.title}&gt;</p>
                <p className="text-sm text-gray-600 break-words">{book.gpt}</p>
              </div>
            </div>
          ))}
        </div>
        <br />
      </div>

      {/* 맨 끝 */}
      <div className='h-40 text-right'>
        <div className='h-28'></div>
        <hr />
        <div className='h-5'></div>
        <span className='text-gray-400'>b:ook</span>
        <div className='h-10'></div>
      </div>


    </div>






  )
}

export default Home;
