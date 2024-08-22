const db = require('../config/database'); // 데이터베이스 연결 설정

// 회원가입                     
exports.join = (data) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO member (mem_id, mem_pw, mem_name, mem_nick, mem_birth, mem_mail, mem_point, enroll_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW())`, 
        [data.mem_id, data.mem_pw, data.mem_name, data.mem_nick, data.mem_birth, data.mem_mail], 
        (err, result) => {
            if (err) {
                console.error('Database Error:', err); // 에러 메시지 출력
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// 사용자 정보 조회
exports.getUser = (mem_id) => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM member WHERE mem_id = ?`, [mem_id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
      });
  });
};


// 이메일 중복체크
exports.getUserByEmail = (mem_email) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM member WHERE mem_mail = ?`, [mem_email], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };

  // 닉네임 중복체크
exports.getUserByNick = (mem_nick) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM member WHERE mem_nick = ?`, [mem_nick], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };

// 아이디 중복체크
exports.getUserId = (mem_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM member WHERE mem_id = ?`, [mem_id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// 아이디 찾기
exports.getUserByEmailAndName = (mem_email, mem_name) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT mem_id FROM member WHERE mem_mail = ? AND mem_name = ?`,
      [mem_email, mem_name],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// 사용자 삭제
exports.deleteUser = (mem_id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM member WHERE mem_id = ?`, [mem_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
