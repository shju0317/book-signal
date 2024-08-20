import React, { useState } from 'react';
import '../css/join.css';

const Join = () => {
  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [memName, setMemName] = useState('');
  const [memNick, setMemNick] = useState('');
  const [memEmail, setMemEmail] = useState('');
  const [memBirth, setMemBirth] = useState('');

  return (
    <div className='page-container'>
      <div className='title-container'>
        <h1 className='title-book'>북</h1>
        <h1 className='title-signal'>시그널</h1>
      </div>
      <div className='join-container'>
        <h4 className='join-title'>회원가입</h4>
        <hr />
        <br />
        <form className='join-form'>
          <div className='input-group'>
            <input
              type='text'
              id='memEmail'
              name='memEmail'
              placeholder="example@gmail.com"
              value={memEmail}
              onChange={() => setMemEmail()}
            />
            <button type="button" className='check-button'>중복확인</button>
          </div>
          <div className='input-group'>
            <input 
              type="text"
              id='memName'
              name='memName'
              placeholder='홍길동'
              value={memName}
              onChange={() => setMemName()} />
              
          </div>
          <div className='input-group'>
            <input
              type="text"
              id="memNick"
              name="memNick"
              placeholder="닉네임   ex) 바나나알러지원숭이"
              value={memNick}
              onChange={() => setMemNick()}
            />
            <button type="button" className='check-button'>중복확인</button>
          </div>
          <div className='input-group'>
            <input 
              type="text"
              id='memId'
              name='memId'
              placeholder='아이디 입력'
              value={memId}
              onChange={() => setMemId()} />
            <button type='button' className='check-button'>중복확인</button>
          </div>
          <div className='input-group'>
            <input 
              type="password"
              id='memPw'
              name='memPw'
              placeholder='비밀번호 입력'
              value={memPw}
              onChange={() => setMemPw()} />
          </div>
          <div className='input-group'>
            <input 
              type="password"
              id='confirmPw'
              name='confirmPw'
              placeholder='비밀번호 확인'
              value={confirmPw}
              onChange={() => setConfirmPw()} />
          </div>
          <div className='input-group'>
            <label htmlFor="memBirth" className='input-label'>생년월일</label>
            <input
              type="date"
              id="memBirth"
              name="memBirth"
              value={memBirth}
              onChange={() => setMemBirth()}
            />
          </div>
          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default Join;
