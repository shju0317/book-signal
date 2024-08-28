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

    // 회원가입이 완료된 후 기본 세팅값을 설정
    const settingResult = await userDB.createUserSetting(mem_id);
    if (!settingResult) {
      throw new Error('기본 세팅값 설정 중 오류가 발생했습니다.');
    }

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

// 아이디 찾기
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

// 비밀번호 설정 페이지로 이동
exports.findPassword = async (req, res) => {
  const { mem_email, mem_id } = req.body;

  try {
    const getUser = await userDB.getUserByEmailAndId(mem_email, mem_id);
    if (getUser.length === 0) {
      return res.status(404).json({ message: '해당 이메일과 아이디에 일치하는 계정이 존재하지 않습니다.' });
    }


    res.status(200).json({ message: '비밀번호 재설정 페이지로 이동합니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};
// 비밀번호 재설정
exports.resetPassword = async (req, res) => {
  const { mem_id, newPw } = req.body;

  try {
    const hashedPw = await bcrypt.hash(newPw, 12);
    await userDB.updatePassword(mem_id, hashedPw); // 비밀번호 업데이트

    res.status(200).json({ message: '비밀번호 재설정이 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '비밀번호 재설정에 실패했습니다.' });
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

// 회원탈퇴 컨트롤러 함수
exports.deleteUser = async (req, res) => {
  const { mem_id, mem_pw } = req.body;

  try {
    // 사용자 인증
    const getUser = await userDB.getUser(mem_id);
    if (getUser.length === 0) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const isMatch = await bcrypt.compare(mem_pw, getUser[0].mem_pw);
    if (!isMatch) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    // 회원 탈퇴 및 연관 데이터 삭제
    await userDB.deleteRelatedData(mem_id);
    await userDB.deleteUser(mem_id);

    res.status(200).json({ message: '회원탈퇴가 완료되었습니다.' });
  } catch (err) {
    console.error('회원탈퇴 중 서버 오류:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};


// 최근 읽은 도서 가져오기
exports.getRecentBooks = async (req, res) => {
  const mem_id = req.session.user.mem_id; // 현재 로그인한 사용자의 mem_id

  try {
    const recentBooks = await userDB.getRecentBooks(mem_id);
    res.status(200).json(recentBooks);
  } catch (error) {
    console.error('최근 읽은 도서 가져오기 실패:', error);
    res.status(500).json({ message: '최근 읽은 도서를 가져오는 중 오류가 발생했습니다.' });
  }
};

// 찜한 도서를 가져오는 함수
exports.getWishlistBooks = async (req, res) => {
  const mem_id = req.session.user.mem_id; // 현재 로그인한 사용자의 mem_id

  try {
    const wishlistBooks = await userDB.getWishlistBooks(mem_id);
    res.status(200).json(wishlistBooks);
  } catch (error) {
    console.error('찜한 도서 가져오기 실패:', error);
    res.status(500).json({ message: '찜한 도서를 가져오는 중 오류가 발생했습니다.' });
  }
};

// 완독 도서 가져오기
exports.getCompletedBooks = async (req, res) => {
  const mem_id = req.session.user.mem_id; // 현재 로그인한 사용자의 mem_id

  try {
    const completedBooks = await userDB.getCompletedBooks(mem_id);
    res.status(200).json(completedBooks);
  } catch (error) {
    console.error('완독 도서 가져오기 실패:', error);
    res.status(500).json({ message: '완독 도서를 가져오는 중 오류가 발생했습니다.' });
  }
};

// 독서 기록을 추가하는 컨트롤러 함수
exports.addReadingRecord = async (req, res) => {
  const { mem_id, book_name } = req.body;

  try {
    const result = await userDB.addReadingRecord(mem_id, book_name);
    res.status(200).json({ message: '독서 기록이 성공적으로 추가되었습니다.', result });
  } catch (error) {
    console.error('독서 기록 추가 에러:', error);
    res.status(500).json({ message: '독서 기록을 추가하는 중 오류가 발생했습니다.', error: error.message });
  }
};

// userDB.js
exports.addReadingRecord = (mem_id, book_name) => {
  return new Promise((resolve, reject) => {
    const getBookIdxQuery = `
      SELECT book_idx FROM book_db WHERE book_name = ?;
    `;

    conn.query(getBookIdxQuery, [book_name], (err, results) => {
      if (err) {
        console.error('book_idx 가져오기 에러:', err);
        reject(err);
      } else if (results.length === 0) {
        reject(new Error('해당 책을 찾을 수 없습니다.'));
      } else {
        const book_idx = results[0].book_idx;

        // book_reading 테이블에 조회 기록 추가 및 book_views 증가
        exports.incrementBookViews(mem_id, book_idx)
          .then(resolve)
          .catch(reject);
      }
    });
  });
};

// 완독 도서를 가져오는 함수
exports.getCompletedBooks = (mem_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT book_db.book_name, book_db.book_cover, book_db.book_writer
      FROM book_end
      JOIN book_db ON book_end.book_idx = book_db.book_idx
      WHERE book_end.mem_id = ?;
    `;

    db.query(sql, [mem_id], (err, results) => {
      if (err) {
        console.error('완독 도서 가져오기 에러:', err);
        reject(new Error('완독 도서를 가져오는 중 오류가 발생했습니다.'));
      } else {
        resolve(results);
      }
    });
  });
};

// 최근 읽은 도서 가져오기
exports.getRecentBooks = (mem_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
          book_db.book_name, 
          book_db.book_writer, 
          book_db.book_cover,
          book_reading.book_latest
      FROM 
          book_reading 
      JOIN 
          book_db 
      ON 
          book_reading.book_name = book_db.book_name 
      WHERE 
          book_reading.mem_id = ?
      ORDER BY 
          book_reading.book_latest DESC
      LIMIT 1;
    `;

    db.query(query, [mem_id], (err, results) => {
      if (err) {
        console.error('Error fetching recent books:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


exports.incrementBookViews = (mem_id, book_idx) => {
  return new Promise((resolve, reject) => {
    const checkIfViewedQuery = `
      SELECT COUNT(*) AS count 
      FROM book_reading 
      WHERE mem_id = ? AND book_idx = ?
    `;

    conn.query(checkIfViewedQuery, [mem_id, book_idx], (err, results) => {
      if (err) {
        console.error('책 조회 확인 중 오류 발생:', err);
        reject(new Error('책 조회 확인에 실패했습니다.'));
        return;
      }

      const hasViewed = results[0].count > 0;

      if (!hasViewed) {
        // 조회하지 않았다면 조회수 증가 및 로그에 기록
        const incrementViewsQuery = `
          UPDATE book_db 
          SET book_views = book_views + 1 
          WHERE book_idx = ?
        `;

        conn.query(incrementViewsQuery, [book_idx], (err) => {
          if (err) {
            console.error('책 조회수 증가 중 오류 발생:', err);
            reject(new Error('책 조회수 증가에 실패했습니다.'));
            return;
          }

          const logViewQuery = `
            INSERT INTO book_reading (mem_id, book_idx, book_name, book_summ, book_latest, book_rp, book_mark)
            VALUES (?, ?, (SELECT book_name FROM book_db WHERE book_idx = ?), '', NOW(), 1, 1)
          `;

          conn.query(logViewQuery, [mem_id, book_idx, book_idx], (err) => {
            if (err) {
              console.error('책 조회 로그 기록 중 오류 발생:', err);
              reject(new Error('책 조회 로그 기록에 실패했습니다.'));
              return;
            }

            resolve();
          });
        });
      } else {
        // 이미 조회한 경우
        resolve();
      }
    });
  });
};