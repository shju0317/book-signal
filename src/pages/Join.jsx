import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/join.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 아이콘 가져오기

const Join = () => {
  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [memName, setMemName] = useState('');
  const [memNick, setMemNick] = useState('');
  const [memBirth, setMemBirth] = useState('');
  const [memEmail, setMemEmail] = useState('');

  const [emailCheck, setEmailCheck] = useState(null);
  const [nickCheck, setNickCheck] = useState(null);
  const [idCheck, setIdCheck] = useState(null);
  const [pwCheck, setPwCheck] = useState(null);
  const navigate = useNavigate();

  // 이메일 중복체크
  const checkEmail = async () => {
    try {
      const res = await fetch(`http://localhost:3001/check-email?mem_email=${memEmail}`);
      const data = await res.json();

      if (data.exists) {
        setEmailCheck({ status: 'error', message: '이미 사용중인 이메일 입니다.' });
      } else {
        setEmailCheck({ status: 'success', message: '사용 가능한 이메일 입니다.' });
      }
    } catch (err) {
      console.error('Error checking Email:', err);
    }
  };

  // 닉네임 중복체크
  const checkNick = async () => {
    try { 
      const res = await fetch(`http://localhost:3001/check-nick?mem_nick=${memNick}`);
      const data = await res.json();
  
      if (data.exists) {
        setNickCheck({ status: 'error', message: '이미 사용중인 닉네임 입니다.' });
      } else {
        setNickCheck({ status: 'success', message: '사용 가능한 닉네임 입니다.' });
      }
    } catch (err) {
      console.error('Error checking Nick:', err);
    }
  };

  // 아이디 중복체크
  const checkId = async () => {
    try {
      const res = await fetch(`http://localhost:3001/check-id?mem_id=${memId}`);
      const data = await res.json();

      if (data.exists) {
        setIdCheck({ status: 'error', message: '이미 사용중인 아이디 입니다.' });
      } else {
        setIdCheck({ status: 'success', message: '사용 가능한 아이디 입니다.' });
      }
    } catch (err) {
      console.error('Error checking ID:', err);
    }
  };

   // 비밀번호 확인
   useEffect(() => {
    if (confirmPw.length > 0) {
      if (memPw === confirmPw) {
        setPwCheck('success');
      } else {
        setPwCheck('error');
      }
    } else {
      setPwCheck(null); // 비밀번호 확인 입력 값이 없을 때는 아이콘을 숨김
    }
  }, [memPw, confirmPw]);
  
  const submitBtn = async (e) => {
    e.preventDefault();
    if(!memId || !memPw || !memName || !memNick || !memBirth || !memEmail){
      alert('모든 정보를 입력해주세요!');
      return;
    }

    if (memPw !== confirmPw) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (
      idCheck?.status === 'error' ||
      nickCheck?.status === 'error' ||
      emailCheck?.status === 'error'
    ) {
      alert('중복 확인을 완료해주세요.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/join', {
        method: 'POST',
        body: JSON.stringify({
          mem_id: memId,
          mem_pw: memPw,
          mem_name: memName,
          mem_nick: memNick,
          mem_birth: memBirth,
          mem_mail: memEmail,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '가입 요청에 실패했습니다.');
      }

      const data = await res.json();
      alert(data.message || '회원가입이 완료되었습니다.');

      if (res.status === 200) {
        navigate('/');
      } else {
        setMemId('');
        setMemPw('');
      }
    } catch (err) {
      console.log(err);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="page-container">
      <div className="title-container">
        <h1 className="title-book">북</h1>
        <h1 className="title-signal">시그널</h1>
      </div>
      <div className="join-container">
        <h4 className="join-title">회원가입</h4>
        <hr />
        <br />
        <form className="join-form">
          <div className="input-group">
            <input
              type="text"
              id="memEmail"
              name="memEmail"
              placeholder="example@gmail.com"
              value={memEmail}
              onChange={(e) => setMemEmail(e.target.value)}
            />
            <button type="button" className="check-button" onClick={checkEmail}>
              중복확인
            </button>
          </div>
            {emailCheck && (
              <p className={`check-result ${emailCheck.status}`}>
                {emailCheck.status === 'error' ? <FaTimesCircle /> : <FaCheckCircle />}
                {emailCheck.message}
              </p>
            )}
          <div className="input-group">
            <input
              type="text"
              id="memName"
              name="memName"
              placeholder="홍길동"
              value={memName}
              onChange={(e) => setMemName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              id="memNick"
              name="memNick"
              placeholder="닉네임   ex) 바나나알러지원숭이"
              value={memNick}
              onChange={(e) => setMemNick(e.target.value)}
            />
            <button type="button" className="check-button" onClick={checkNick}>
              중복확인
            </button>
          </div>
            {nickCheck && (
              <p className={`check-result ${nickCheck.status}`}>
                {nickCheck.status === 'error' ? <FaTimesCircle /> : <FaCheckCircle />}
                {nickCheck.message}
              </p>
            )}
          <div className="input-group">
            <input
              type="text"
              id="memId"
              name="memId"
              placeholder="아이디 입력"
              value={memId}
              onChange={(e) => setMemId(e.target.value)}
            />
            <button type="button" className="check-button" onClick={checkId}>
              중복확인
            </button>
          </div>
            {idCheck && (
              <p className={`check-result ${idCheck.status}`}>
                {idCheck.status === 'error' ? <FaTimesCircle /> : <FaCheckCircle />}
                {idCheck.message}
              </p>
            )}
          <div className="input-group">
            <input
              type="password"
              id="memPw"
              name="memPw"
              placeholder="비밀번호 입력"
              value={memPw}
              onChange={(e) => setMemPw(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="confirmPw"
              name="confirmPw"
              placeholder="비밀번호 확인"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              />
              {pwCheck && (
                <span className="password-icon">
                  {pwCheck === 'error' ? <FaTimesCircle color="red" /> : <FaCheckCircle color="green" />}
                </span>
              )}
          </div>
          <div className="input-group">
            <label htmlFor="memBirth" className="input-label">생년월일</label>
            <input
              type="date"
              id="memBirth"
              name="memBirth"
              value={memBirth}
              onChange={(e) => setMemBirth(e.target.value)}
            />
          </div>
          <button type="submit" onClick={submitBtn}>
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Join;
