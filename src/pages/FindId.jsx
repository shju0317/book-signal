import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/findid.css';

const FindId = () => {
    const [memEmail, setMemEmail] = useState('');
    const [memName, setMemName] = useState('');
    const navigate = useNavigate();

    // 타이틀 컨테이너 클릭 시 Home 페이지로 이동
    const handleTitleClick = () => {
        navigate('/');
    };

    return (
        <div className="findid-container">
            <div className='title-container' onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                <h1 className='title-book'>북</h1>
                <h1 className='title-signal'>시그널</h1>
            </div>
            <div className='findid-form-container'>
                <h4 className='findid-title'>아이디 찾기</h4>
                <hr />
                <br />
                <form action="" className="findid-form">
                    <div className="input-group">
                        <input 
                            type="text"
                            className='input-field'
                            id='memEmail'
                            name='memEmail'
                            placeholder='example@gmail.com'
                            value={memEmail}
                            onChange={(e) => setMemEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <input 
                            type="text"
                            className='input-field'
                            id='memName'
                            name='memName'
                            placeholder='홍길동'
                            value={memName}
                            onChange={(e) => setMemName(e.target.value)} />
                    </div>
                    <button type="submit" className="findid-button">다음</button>
                </form>
            </div>
            <div className="findid-footer">
                <Link to="/FindPw">비밀번호 찾기</Link> | <Link to="/Login">로그인</Link> | <Link to="/Join">회원가입</Link>
            </div>
        </div>
    );
}

export default FindId;
