import React from 'react'
import Search from './Search'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate();

  return (
    <header style={{display:'flex'}}>
      <h1>북시그널</h1>
      <ul style={{listStyleType:'none', display:'flex'}}>
        <li><Link to="/mylib">내 서재</Link></li>
        <li><Link to="/mypage">마이페이지</Link></li>
      </ul>
      <Search/>
      <button type='button' onClick={()=>{navigate('/logout')}}>로그아웃</button>
    </header>
  )
}

export default Header