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
