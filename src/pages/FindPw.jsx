import React, { useState } from 'react';

const FindPw = () => {

    const [memEmail, setMemEmail] = useState('');
    const [memId, setMemId] = useState('');

    return (
        <div>
            <h4>비밀번호 찾기</h4>
            <form action="">
                <div>
                    <label htmlFor="memEmail" className=''>이메일</label>
                    <input type="text"
                        className=''
                        id='memEmail'
                        name='memEmail'
                        placeholder='이메일을 입력하세요'
                        value={memEmail}
                        onChange={() => { }} />
                </div>
                <div>
                    <label htmlFor="memId" className=''>아이디</label>
                    <input type="text"
                        className=''
                        id='memId'
                        name='memId'
                        placeholder='아이디를 입력하세요'
                        value={memId}
                        onChange={() => { }} />
                </div>
                <button type="submit" className="">비밀번호 찾아주겠노라~!</button>
            </form>
        </div>
    )
}

export default FindPw