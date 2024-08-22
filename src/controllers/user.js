const bcrypt = require('bcrypt');
const userDB = require('../models/userDB');

const textToHash = async (text) => {
  const saltRounds = 12;

  try {
    const hash = await bcrypt.hash(text, saltRounds);
    return hash;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 회원가입
exports.join = async (req, res) => {
  const { mem_id, mem_pw, mem_name, mem_nick, mem_birth, mem_mail } = req.body;

  if (!mem_id || !mem_pw || !mem_name || !mem_nick || !mem_birth || !mem_mail) {
    return res.status(400).json({ message: '모든 정보를 입력해주시기 바랍니다.' });
  }

  try {
    const getUser = await userDB.getUserId(mem_id);
    if (getUser.length) {
      res.status(401).json({ message: '이미 존재하는 아이디입니다.' });
      return;
    }

    const hash = await textToHash(mem_pw);
    const signUp = await userDB.join({
      mem_id,
      mem_pw: hash,
      mem_name,
      mem_nick,
      mem_birth,
      mem_mail,
      mem_point: 0,
      enroll_at: new Date()
    });
    res.status(200).json({ message: '가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 암호화 비교
const hashCompare = async (inputValue, hash) => {
  try {
    const isMatch = await bcrypt.compare(inputValue, hash);
    return isMatch;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 로그인
exports.login = async (req, res) => {
  const { mem_id, mem_pw, autologin } = req.body;

  try {
    const getUser = await userDB.getUser(mem_id);
    if (getUser.length === 0) {
      return res.status(401).json({
        message: '*아이디 또는 비밀번호가 잘못되었습니다.<br />아이디와 비밀번호를 정확히 입력해주세요.'
      });
    }

    const isMatch = await hashCompare(mem_pw, getUser[0].mem_pw);

    if (!isMatch) {
      return res.status(401).json({
        message: '*아이디 또는 비밀번호가 잘못되었습니다.<br />아이디와 비밀번호를 정확히 입력해주세요.'
      });
    }

    // 세션에 사용자 정보 저장
    req.session.user = {
      mem_id: getUser[0].mem_id,
      mem_nick: getUser[0].mem_nick,
      email: getUser[0].mem_mail,
      point: getUser[0].mem_point,
      name: getUser[0].mem_name,
    };

    // 자동 로그인 설정에 따른 세션 만료 시간 설정
    if (autologin) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7일간 유지
  } else {
      req.session.cookie.maxAge = null; // 브라우저 종료 시 세션 삭제
      req.session.cookie.expires = null; // 명시적으로 expires를 null로 설정
  }
    res.status(200).json({
      message: '로그인 성공',
      user: {
        mem_id: getUser[0].mem_id,
        mem_nick: getUser[0].mem_nick
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};





// 이메일 중복 체크 함수
exports.getUserByEmail = async (mem_email) => {
  try {
    const getUser = await userDB.getUserByEmail(mem_email);
    return getUser;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 닉네임 중복 체크 함수
exports.getUserByNick = async (mem_nick) => {
  try {
    const getUser = await userDB.getUserByNick(mem_nick);
    return getUser;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 아이디 중복 체크 함수
exports.getUserId = async (mem_id) => {
  try {
    const getUser = await userDB.getUserId(mem_id);
    return getUser;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.findId = async (req, res) => {
  const { mem_email, mem_name } = req.body;

  try {
    const getUser = await userDB.getUserByEmailAndName(mem_email, mem_name);
    if (getUser.length === 0) {
      return res.status(404).json({ message: '해당 정보로 가입된 아이디를 찾을 수 없습니다.' });
    }

    // 아이디를 성공적으로 찾은 경우
    res.status(200).json({ mem_id: getUser[0].mem_id, mem_name: getUser[0].mem_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 로그아웃
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 실패' });
    }
    res.clearCookie('connect.sid'); // 세션 쿠키 삭제
    return res.status(200).json({ message: '로그아웃 성공' });
  });
};

// 회원탈퇴
exports.deleteUser = async (req, res) => {
  const { mem_id, mem_pw } = req.body;

  try {
    const getUser = await userDB.getUser(mem_id);
    if (getUser.length === 0) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const isMatch = await bcrypt.compare(mem_pw, getUser[0].mem_pw);
    if (!isMatch) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    // 세션 파기
    req.session.destroy(async (err) => {
      if (err) {
        console.error('세션 삭제 중 오류:', err);
        return res.status(500).json({ message: '회원탈퇴 중 오류가 발생했습니다.' });
      }

      res.clearCookie('connect.sid'); // 세션 쿠키 삭제

      // 사용자 삭제
      await userDB.deleteUser(mem_id);

      res.status(200).json({ message: '회원탈퇴가 완료되었습니다.' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

