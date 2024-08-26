import React from 'react';
import SlideShow from '../components/SlideShow';
import SLIDES from '../data/slides';
import { Link } from 'react-router-dom';
import '../css/fonts.css';
import '../css/main.css';

// 인기
const bookBest = [
  { title: '별 헤는 밤', author: '저자/옮긴이', image: '../images/cover(10).jpg' },
  { title: '서시', author: '저자/옮긴이', image: '../images/cover(11).jpg' },
  { title: '광염 소나타', author: '저자/옮긴이', image: '../images/cover(24).jpg' },
  { title: '꼬부랑 할머니', author: '저자/옮긴이', image: '../images/cover(63).jpg' },
  { title: 'B사감과 러브레터', author: '저자/옮긴이', image: '../images/cover(28).jpg' }
];


// 평점
const reviewBest = [
  { title: '나의 유년시절', author: '저자/옮긴이', image: '../images/cover(0).jpg' },
  { title: '사랑하는 까닭', author: '저자/옮긴이', image: '../images/cover(19).jpg' },
  { title: '나비의 꿈', author: '저자/옮긴이', image: '../images/cover(61).jpg' },
  { title: '허생전', author: '저자/옮긴이', image: '../images/cover(34).jpg' },
  { title: '향수', author: '저자/옮긴이', image: '../images/cover(15).jpg' }
];

// 신작
const newBook = [
  { title: '한의 신문 제 2461호', author: '저자/옮긴이', image: '../images/cover(90).jpg' },
  { title: 'AI 영화영상콘텐츠를 위한 AI 예술창작 사례연구', author: '저자/옮긴이', image: '../images/cover(80).jpg' },
  { title: '자율주행차량 상황 정보 알림 시스템', author: '저자/옮긴이', image: '../images/cover(88).jpg' },
  { title: '머신러닝 기반 메모리 성능', author: '저자/옮긴이', image: '../images/cover(86).jpg' },
  { title: '아이트래킹 연구 활성화를 위한 모바일 아이트래커의 활용', author: '저자/옮긴이', image: '../images/cover(83).jpg' }
];

// 최근읽은
const readNow = [
  { title: '누이 마음아 나를 보아라', author: '저자/옮긴이', image: '../images/cover(2).jpg' },
  { title: '진달래꽃', author: '저자/옮긴이', image: '../images/cover(3).jpg' },
  { title: '해협의 로맨티시즘', author: '저자/옮긴이', image: '../images/cover(4).jpg' },
  { title: '님의 손길', author: '저자/옮긴이', image: '../images/cover(8).jpg' },
  { title: '운수 좋은 날', author: '저자/옮긴이', image: '../images/cover(17).jpg' }
];

// 추천시그널
const signal = [
  { title: '봄·봄', gpt: '지피티추천', image: '../images/cover(21).jpg' },
  { title: '약한 자의 슬픔2', gpt: '지피티추천', image: '../images/cover(22).jpg' },
  { title: '탁류', gpt: '지피티추천', image: '../images/cover(35).jpg' },
];


const Home = () => {
  return (
    <div className='max-w-screen-xl mx-auto' style={{ maxWidth: '1280px' }}>
      {/* 슬라이드 */}
      <br />
      <SlideShow slides={SLIDES} />
      <br />

      <h2 className='flex justify-between items-end mt-28 mb-0 text-black'>
        지금, 많이 읽은 그 작품
        <Link to="/ranking/popular" className="text-sm text-gray-400">
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
      <h2 className='flex justify-between items-end mt-6 mb-0 text-black'>
        평점, BEST!
        <Link to="/ranking/best" className="text-sm text-gray-400">
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
      <h2 className='flex justify-between items-end mt-6 mb-0 text-black'>
        갓 나온 신작
        <Link to="/ranking/new" className="text-sm text-gray-400">
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
      <h2 className='flex justify-between items-end mt-6 mb-0 text-black'>
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
      <h2 className='flex justify-between items-end mt-6 mb-0 text-black'>
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
