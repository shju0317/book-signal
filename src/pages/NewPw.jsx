import React from 'react'

const NewPw = () => {

    const [newPw, setNewPw] = useState('');
    const [confirmNewPw, setConfirmNewPw] = useState('');

    return (
        <div>
            <h4>비밀번호 재설정</h4>
            <form action="">
                <div>
                    <label htmlFor="newPw" className=''>새 비밀번호</label>
                    <input type="password"
                        className=''
                        id='newPw'
                        name='newPw'
                        placeholder='새 비밀번호 입력'
                        value={newPw}
                        onChange={() => { }} />
                </div>
                <div>
                    <label htmlFor="confirmNewPw" className=''>새 비밀번호 확인</label>
                    <input type="password"
                        className=''
                        id='confirmNewPw'
                        name='confirmNewPw'
                        placeholder='새 비밀번호 입력'
                        value={confirmNewPw}
                        onChange={() => { }} />
                </div>
                <button type="submit" className="">비밀번호 재설정</button>
            </form>
        </div>
    )
}

export default NewPw