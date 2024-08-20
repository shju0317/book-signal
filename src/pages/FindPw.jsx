import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/findpw.css';

const FindPassword = () => {
    const [memEmail, setMemEmail] = useState('');
    const [memId, setMemId] = useState('');

    return (
        <div className="findpw-container">
            <div className='title-container'>
                <h1 className='title-book'>북</h1>
                <h1 className='title-signal'>시그널</h1>
            </div>
            <div className='findpw-form-container'>
                <h4 className='findpw-title'>비밀번호 찾기</h4>
                <hr />
                <br />
                <form action="" className="findpw-form">
                    <div className="input-group">
                        <input
                            type="text"
                            className='input-field'
                            id='memEmail'
                            name='memEmail'
                            placeholder='example@gmail.com'
                            value={memEmail}
                            onChange={() => setMemEmail()} />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            className='input-field'
                            id='memId'
                            name='memId'
                            placeholder='아이디'
                            value={memId}
                            onChange={() => setMemId()} />
                    </div>
                    <button type="submit" className="findpw-button">다음</button>
                </form>
            </div>
            <div className="findpw-footer">
                <Link to="/FindId">아이디 찾기</Link> | <Link to="/Login">로그인</Link> | <Link to="/Join">회원가입</Link>
            </div>
        </div>
    );
}

export default FindPassword;
