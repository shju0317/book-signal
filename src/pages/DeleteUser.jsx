import React, { useState } from 'react';
import '../css/deleteuser.css';

const DeleteUser = () => {
  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');

  return (
    <div className='deleteuser-page'>
      <div className='title-container'>
        <h1 className='title-book'>북</h1>
        <h1 className='title-signal'>시그널</h1>
      </div>
      <div className="form-container">
        <h4 className="deleteuser-title">회원탈퇴</h4>
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
          <button type="submit" className="deleteuser-button">회원탈퇴</button>
        </form>
      </div>
    </div>
  );
}

export default DeleteUser;
