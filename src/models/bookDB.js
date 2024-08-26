const db = require('../config/database');

// 특정 사용자의 리뷰 데이터를 가져오기
exports.getUserReviews = (mem_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT end_idx,book_name,book_cover ,book_score, book_review 
      FROM book_end 
      WHERE mem_id = ?
    `;
    db.query(query, [mem_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// 리뷰 삭제 기능 (추가적으로 사용 가능)
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