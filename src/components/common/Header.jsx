import React, { useContext } from 'react';
import Search from './Search';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include', // 세션 쿠키를 포함하여 전송
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
      } else {
        console.error('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <header className='max-w-screen-xl mx-auto mb-8 flex justify-between items-center px-2 py-5 font-semibold'>
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
        {!isAuthenticated ? (
          <>
            <button type='button' onClick={() => navigate('/join')} className='mr-5'>회원가입</button>
            <button type='button' onClick={() => navigate('/login')}>로그인</button>
          </>
        ) : (
          <>
            <span className='mr-5'>{user?.mem_nick}님</span>
            <button type='button' onClick={handleLogout}>로그아웃</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;