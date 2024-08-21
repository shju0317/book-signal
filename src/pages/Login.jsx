import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');
  const [autologin, setAutoLogin] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mem_id: memId, mem_pw: memPw }),
      });

     // const data = await response.json();

      if (response.ok) {
        alert('로그인 성공!');
        navigate('/');
        // 로그인 성공 시 추가 로직 (예: 페이지 이동)
      } else {
        alert('아이디나 비밀번호를 확인해주세요.')
      }
    } catch (error) {
      console.error('Login Error:', error);
      
    }
  };

  return (
    <div className='page-container'>
      <div className='title-container'>
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
          <p className="error-message">
            * 아이디 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.
          </p>
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
