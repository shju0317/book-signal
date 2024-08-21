import React, { useState } from 'react';
import '../css/deleteuser.css'

const DeleteUser = () => {

  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');

  return (
    <div className='deleteuser-container'>
      <div className='title-container'>
        <h1 className='title-book'>북</h1>
        <h1 className='title-signal'>시그널</h1>
      </div>
      <div className="login-container">
        <h4 className="login-title">회원탈퇴</h4>
        <hr />
        <br />
        <form className="deleteuser-form">
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              id="memId"
              name="memId"
              placeholder="아이디 입력"
              value={memId}
              onChange={() => setMemId()}
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
              onChange={() => setMemPw()}
            />
          </div>
          <button type="submit" className="login-button">로그인</button>
        </form>
      </div>
    </div>
  )
}

export default DeleteUser