import React, { useEffect, useState } from 'react';
import RankingBookInfo from '../components/book/RankingBookInfo'
import axios from 'axios'

const RankingBookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/ranking')
      .then(response => {
        console.log(response.data); 
        
        if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          console.error('API 응답이 배열이 아닙니다.');
          setBooks([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('오류:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <section className='max-w-screen-xl m-auto'>
      <h2 className='sr-only'>랭킹 도서 목록</h2>
      <ul className='flex flex-wrap justify-start gap-5'>
        {/* 도서 리스트 렌더링 */}
        {books.length > 0 ? (
          books.map((book, index) => (
            <RankingBookInfo key={index} book={book} ranking={index + 1} />
          ))
        ) : (
          <p>결과가 없습니다.</p>
        )}
      </ul>
    </section>
  )
}

export default RankingBookList