import React, { useEffect, useContext } from 'react';
import Header from '../components/common/Header';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../App';

const RootLayout = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/check-session', {
          method: 'GET',
          credentials: 'include', // 세션 쿠키를 포함하여 전송
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsAuthenticated(true);
            setUser({ mem_id: data.user.mem_id, mem_nick: data.user.mem_nick });
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('세션 확인 실패:', err);
      }
    };

    checkLoginStatus();
  }, [setIsAuthenticated, setUser]);

  return (
    <div className='min-w-xs'>
      <Header/>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}

export default RootLayout;
