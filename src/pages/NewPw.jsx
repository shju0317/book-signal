import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/newpw.css';

const NewPw = () => {

    const [newPw, setNewPw] = useState('');
    const [confirmNewPw, setConfirmNewPw] = useState('');

    return (
        <div className="newpw-container">
            <div className='title-container'>
                <h1 className='title-book'>북</h1>
                <h1 className='title-signal'>시그널</h1>
            </div>
            <div className='newpw-form-container'>
                <h4 className='newpw-title'>비밀번호 재설정</h4>
                <hr />
                <br />
                <form action="" className="newpw-form">
                    <div className="input-group">
                        <input 
                            type="password" 
                            className='input-field' 
                            id='newPw' 
                            name='newPw' 
                            placeholder='새 비밀번호 입력' 
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            className='input-field' 
                            id='confirmNewPw' 
                            name='confirmNewPw' 
                            placeholder='새 비밀번호 입력' 
                            value={confirmNewPw}
                            onChange={(e) => setConfirmNewPw(e.target.value)} />
                    </div>
                    <button type="submit" className="newpw-button">비밀번호 재설정</button>
                </form>
            </div>
            {/* Link 요소들을 newpw-form-container 외부에 배치 */}
            <div className="newpw-footer">
                <Link to="/FindId">아이디 찾기</Link> | <Link to="/Login">로그인</Link> | <Link to="/Join">회원가입</Link>
            </div>
        </div>
    );
}

export default NewPw;
