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

                if (book.book_cover) {
                    // 파일이 존재할 경우 URL 경로 설정
                    book.book_cover = `images/${book.book_cover}`;
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
