import React from 'react';
import Search from './Search';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className='max-w-screen-xl mx-auto flex justify-between items-center px-2 py-5 font-semibold'>
      <h1 className='text-4xl font-bold font-logo'>
        <Link to="/"><span className='text-primary'>북 </span>시그널</Link>
      </h1>
      <ul className='flex gap-6 ml-[-450px] text-xl'>
        <li>
          <NavLink
            to="/mylib"
            className={({ isActive }) => 
              isActive ? 'text-primary' : 'hover:text-primary'
            }
          >
            내 서재
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mypage"
            className={({ isActive }) => 
              isActive ? 'text-primary' : 'hover:text-primary'
            }
          >
            마이페이지
          </NavLink>
        </li>
      </ul>
      <Search/>
      <div className='text-xl ml-[-450px]'>
        <button type='button' onClick={()=>{navigate('/join')}} className='mr-5'>회원가입</button>
        <button type='button' onClick={()=>{navigate('/login')}}>로그인</button>
      </div>
    </header>
  );
}

export default Header;
