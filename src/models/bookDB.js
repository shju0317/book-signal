const { log } = require('console');
const conn = require('../config/database');
const fs = require('fs');
const path = require('path');

// 도서 정보 검색 함수
exports.searchBooks = (searchQuery) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT book_name, book_writer, book_cover FROM book_db WHERE book_name LIKE ?`;
        const formattedQuery = `%${searchQuery}%`;

        conn.query(sql, [formattedQuery], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            // 서버에 이미지가 있는지 확인
            const updatedResults = results.map(book => {
                // book_cover가 URI 인코딩된 상태라면 디코딩
                book.book_cover = decodeURIComponent(book.book_cover);
                console.log('여기야?', book.book_cover);

                if (book.book_cover) {
                    // 파일이 존재할 경우 URL 경로 설정
                    book.book_cover = `images/${book.book_cover}`;
                    console.log('여기네', book.book_cover);
                } else {
                    // 파일이 존재하지 않을 경우 기본 이미지 설정
                    book.book_cover = 'default.jpg'; // 기본 이미지 경로 설정
                    console.log('File not found, using default image');
                }
                return book;
            });

            resolve(updatedResults);
        });
    });
};


/******************** 랭킹 도서 목록 ********************/
const getBooks = (orderBy, limit = 12) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT *
        FROM book_db
        ORDER BY ${orderBy}
        LIMIT ${limit}
      `;
  
      conn.query(sql, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        const updatedResults = results.map(book => {
          book.book_cover = decodeURIComponent(book.book_cover);
          if (book.book_cover) {
            book.book_cover = `images/${book.book_cover}`;
          } else {
            book.book_cover = 'images/default.jpg';
          }
          return book;
        });
  
        resolve(updatedResults);
      });
    });
  };
  
  // 인기 랭킹 도서 목록
  exports.popularBooks = () => {
    return getBooks('book_views DESC');
  };
  
  // 평점 베스트 도서 목록
  exports.bestBooks = () => {
    // return getBooks('book_rating DESC');
    return getBooks('book_published_at DESC');
  };
  
  // 신작 도서 목록
  exports.newBooks = () => {
    return getBooks('book_published_at DESC');
  };
  

  /******************** 찜하기 ********************/
  // 찜한 도서 여부 확인
  exports.checkWishlist = (mem_id, book_idx) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS count FROM book_wishlist WHERE mem_id = ? AND book_idx = ?`;

        conn.query(sql, [mem_id, book_idx], (err, results) => {
            if (err) {
                console.error('찜한 도서 여부 확인 에러:', err);
                reject(new Error('찜한 도서 여부 확인에 실패했습니다.'));
                return;
            }

            resolve(results[0].count > 0);
        });
    });
  };

  // 찜하기
  exports.addWishlist = (mem_id, book_idx) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO book_wishlist (mem_id, book_idx) VALUES (?, ?)`;

        conn.query(sql, [mem_id, book_idx], (err, result) => {
            if (err) {
                console.error('도서 찜하기 에러:', err);
                reject(new Error('도서 찜하기에 실패했습니다.'));
                return;
            }

            resolve({ message: '도서가 찜 목록에 추가되었습니다.' });
        });
    });
};

// 찜한 도서 제거
exports.removeWishlist = (mem_id, book_idx) => {
  return new Promise((resolve, reject) => {
      const sql = `DELETE FROM book_wishlist WHERE mem_id = ? AND book_idx = ?`;

      conn.query(sql, [mem_id, book_idx], (err, result) => {
          if (err) {
              console.error('찜한 도서 제거 에러:', err);
              reject(new Error('찜한 도서 제거에 실패했습니다.'));
              return;
          }

          resolve({ message: '도서가 찜 목록에서 제거되었습니다.' });
      });
  });
};