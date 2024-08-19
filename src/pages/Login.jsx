import React, { useState } from 'react';
import '../css/login.css'

const Login = () => {

  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');
  const [autologin, setAutoLogin] = useState(false);

  return (
    <div>
      <h4>로그인</h4>
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
            <input type="checkbox"
            id='autologin'
            name='autologin'
            checked={autologin}
            onChange={()=>setAutoLogin(!autologin)} />
            <label htmlFor="autologin">자동 로그인</label>
        </div>
        <button type="submit" className="">로그인 하여라~!</button>
      </form>
    </div>
  )
}

export default Login