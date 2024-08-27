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

// 회원 세팅 테이블 자동 생성
exports.createUserSetting = (mem_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO setting (mem_id, font, font_size, dark) VALUES (?, NULL, '16', 'light')`,
      [mem_id],
      (err, result) => {
        if (err) {
          console.error('Database Error:', err); // 에러 메시지 출력
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
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

// 아이디 찾기 (이메일,이름)
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

// 비밀번호 찾기 (이메일,아이디)
exports.getUserByEmailAndId = (mem_email, mem_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM member WHERE mem_mail = ? AND mem_id = ?`,
      [mem_email, mem_id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// 비밀번호 업데이트 함수
exports.updatePassword = (mem_id, newPw) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE member SET mem_pw = ? WHERE mem_id = ?`,
      [newPw, mem_id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// 최근 읽은 도서 가져오기
exports.getRecentBooks = (mem_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
          book_db.book_name, 
          book_db.book_writer, 
          book_db.book_cover 
      FROM 
          book_reading 
      JOIN 
          book_db 
      ON 
          book_reading.book_name = book_db.book_name 
      WHERE 
          book_reading.mem_id = ?;
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

// 찜한 도서를 가져오는 함수
exports.getWishlistBooks = (mem_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT book_db.book_name, book_db.book_cover, book_db.book_writer
      FROM book_wishlist
      JOIN book_db ON book_wishlist.book_idx = book_db.book_idx
      WHERE book_wishlist.mem_id = ?;
    `;

    db.query(sql, [mem_id], (err, results) => {
      if (err) {
        console.error('찜한 도서 가져오기 에러:', err);
        reject(new Error('찜한 도서를 가져오는 중 오류가 발생했습니다.'));
      } else {
        resolve(results);
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
