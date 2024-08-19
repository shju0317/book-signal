import React, { useState } from 'react';

const FindId = () => {

    const [memEmail, setMemEmail] = useState('');
    const [memName, setMemName] = useState('');

    return (
        <div>
            <h4>아이디 찾기</h4>
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
                    <label htmlFor="memName" className=''>이름</label>
                    <input type="text"
                        className=''
                        id='memName'
                        name='memName'
                        placeholder='이름을 입력하세요'
                        value={memName}
                        onChange={() => { }} />
                </div>
                <button type="submit" className="">아이디 찾아주겠노라~!</button>
            </form>
        </div>
    )
}

export default FindId