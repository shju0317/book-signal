import React from 'react'
import Search from './Search'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className='flex justify-between items-center px-2 py-5 font-semibold'>
      <h1 className='text-4xl font-bold font-logo'>
        <Link to="/"><span className='text-primary'>북</span>시그널</Link>
      </h1>
      <ul className='flex gap-6'>
        <li><Link to="/mylib">내 서재</Link></li>
        <li><Link to="/mypage">마이페이지</Link></li>
      </ul>
      <Search/>
      <button type='button' onClick={()=>{navigate('/login')}}>로그인</button>
    </header>
  )
}

export default Header