import React from 'react'
import { FaRegStar } from "react-icons/fa6";

const RankingBookInfo = () => {
  return (
    <li className='flex flex-grow border rounded-xl shadow-lg'>
      <div className='book-cover-wrapper w-[100px] h-[150px]'>
        <img src='book_cover_sample.jpg' alt="이미지" className='w-full h-full object-cover rounded-xl'/>
      </div>
      <div className='book-info-contents flex flex-col text-md px-5 my-auto'>
        <p className='text-3xl font-bold italic text-primary'>1</p>
        <p className='text-xl font-semibold mb-5'>나의 눈부신 친구</p>
        <div className='flex gap-3'>
          <p>홍길동<span>저자</span></p>
          <p className='before:content-["|"] before:mr-3'>홍길순<span>옮김</span></p>
        </div>
        <p className='flex items-center'>
          <span className='sr-only'>평점</span>
          <FaRegStar />
          <strong className='ml-1'>4.5</strong>
        </p>
      </div>
    </li>
  )
}

export default RankingBookInfo