import React, { useState } from 'react';
import '../css/join.css'

const Join = () => {

  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');
  const [confrimPw, setConfirmPw] = useState('');
  const [memName, setMemName] = useState('');
  const [memNick, setMemNick] = useState('');
  const [memEmail, setMemEmail] = useState('');
  const [memBirth, setMemBirth] = useState('');

  return (
    <div>
      <h4>회원가입</h4>
      <form action="">
        <div>
          <label htmlFor="memId" className=''>아이디</label>
          <input type="text"
          className=''
          id='memId'
          name='memId'
          placeholder='아이디를 입력하세요'
          value={memId}
          onChange={()=>{}} />
          <button type='button' onClick={''}>아이디 중복확인</button>
        </div>
        <div>
          <label htmlFor="memPw" className=''>비밀번호</label>
          <input type="password"
          className=''
          id='memPw'
          name='memPw'
          placeholder='비밀번호를 입력하세요'
          value={memPw}
          onChange={()=>{}} />
        </div>
        <div>
          <label htmlFor="confirmPw" className=''>비밀번호 재확인</label>
          <input type="password"
          className=''
          id='comfirmPw'
          name='confirmPw'
          placeholder='비밀번호를 다시 입력하세요'
          value={confrimPw}
          onChange={()=>{}} />
        </div>
        <div>
          <label htmlFor="memName" className=''>이름</label>
          <input type="text"
          className=''
          id='memName'
          name='memName'
          placeholder='이름을 입력하세요'
          value={memName}
          onChange={()=>{}} />
        </div>
        <div>
        <label htmlFor="memEmail" className=''>이메일</label>
          <input
            type='memEmail'
            className=''
            id='memEmail'
            name='memEmail'
            placeholder="이메일을 입력하세요"
            value={memEmail}
            onChange={()=>{}}
          />
          <button type="button" onClick={''}>이메일 중복 확인</button>
        </div>
        <div>
          <label htmlFor="memNick" className="">닉네임</label>
          <input
            type="text"
            className=""
            id="memNick"
            name="memNick"
            placeholder="닉네임을 입력하세요"
            value={memNick}
            onChange={()=>{}}
          />
          <button type="button" onClick={''}>닉네임 중복 확인</button>
        </div>
        <div>
          <label htmlFor="memBirth" className="">생년월일</label>
          <input
            type="date"
            className=""
            id="memBirth"
            name="memBirth"
            value={memBirth}
            onChange={()=>{}}
          />
        </div>
        <button type="submit" className="">회원가입 하여라~!</button>
      </form>
    </div>
  )
}

export default Join