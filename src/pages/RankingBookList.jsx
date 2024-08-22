import React from 'react'
import RankingBookInfo from '../components/book/RankingBookInfo'

const RankingBookList = () => {
  return (
    <section className='max-w-screen-xl m-auto'>
      <h2 className='sr-only'>랭킹 도서 목록</h2>
      <ul className='flex flex-wrap justify-start gap-5'>
        <RankingBookInfo/>
        <RankingBookInfo/>
        <RankingBookInfo/>
        <RankingBookInfo/>
        <RankingBookInfo/>
        <RankingBookInfo/>
      </ul>
    </section>
  )
}

export default RankingBookList