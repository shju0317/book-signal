const db = require('../config/database');

// 사용자가 작성한 리뷰와 도서 정보를 가져오는 함수
exports.getUserReviewsWithBooks = (mem_id) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT end_idx,book_name,book_score,book_review,book_cover
        FROM book_end
        WHERE mem_id = ?
    `;

    db.query(query, [mem_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// 리뷰 삭제 기능
exports.deleteReview = (reviewId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM book_end WHERE end_idx = ?`;
    db.query(query, [reviewId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// 리뷰 데이터 삽입
exports.addReview = (data) => {
  return new Promise((resolve, reject) => {
      const sql = `INSERT INTO book_end (mem_id, book_idx, book_name, book_score, book_review) VALUES (?, ?, ?, ?, ?)`;
      conn.query(sql, [data.mem_id, data.book_idx, data.book_name, data.book_score, data.book_review], (err, result) => {
          if (err) {
              reject(err);
          } else {
              resolve(result);
          }
      });
  });
};

// 포인트 업데이트
exports.updateMemberPoints = (mem_id, points) => {
  return new Promise((resolve, reject) => {
      const sql = `UPDATE member SET mem_point = mem_point + ? WHERE mem_id = ?`;
      conn.query(sql, [points, mem_id], (err, result) => {
          if (err) {
              reject(err);
          } else {
              resolve(result);
          }
      });
  });
};