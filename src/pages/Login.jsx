import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');
  const [autologin, setAutoLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
  const navigate = useNavigate();

  const login = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mem_id: memId, mem_pw: memPw, autologin }),
    });

    if (response.ok) {
       navigate('/'); // 로그인 성공 시 메인 페이지로 이동
    } else {
      const data = await response.json();
      setErrorMessage(data.message); // 서버에서 받은 오류 메시지 설정
    }
  } catch (error) {
    console.error('Login Error:', error);
    setErrorMessage('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
  }
};


  // 타이틀 컨테이너 클릭 시 Home 페이지로 이동
  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <div className='page-container'>
      <div className='title-container' onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
        <h1 className='title-book'>북</h1>
        <h1 className='title-signal'>시그널</h1>
      </div>
      <div className="login-container">
        <h4 className="login-title">로그인</h4>
        <hr />
        <br />
        <form className="login-form">
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              id="memId"
              name="memId"
              placeholder="아이디 입력"
              value={memId}
              onChange={(e) => setMemId(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              className="input-field"
              id="memPw"
              name="memPw"
              placeholder="비밀번호 입력"
              value={memPw}
              onChange={(e) => setMemPw(e.target.value)}
            />
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="autologin"
              name="autologin"
              checked={autologin}
              onChange={() => setAutoLogin(!autologin)}
            />
            <label htmlFor="autologin" className="checkbox-label">자동 로그인</label>
          </div>
          {errorMessage && <p className="error-message" dangerouslySetInnerHTML={{ __html: errorMessage }}></p>
        }
          <button type="submit" className="login-button" onClick={login}>로그인</button>
        </form>
      </div>
      <div className="footer-wrapper">
        <div className="login-footer">
          <Link to="/FindId">아이디 찾기</Link> | <Link to="/FindPw">비밀번호 찾기</Link> | <Link to="/Join">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
