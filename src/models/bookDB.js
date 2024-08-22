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
                // 한글 파일 이름 처리
                const decodedFileName = decodeURIComponent(book.book_name);
                console.log(decodedFileName);

                // 실제 파일 경로 확인
                const imagePath = path.join(__dirname, '../public/images', decodedFileName);

                // 경로를 콘솔에 출력하여 확인
                console.log('Checking file at path:', imagePath);

                if (fs.existsSync(imagePath)) {
                    // 파일이 존재할 경우 URL 경로 설정
                    book.book_cover = `${decodedFileName}.jpg`;
                    console.log(book.book_cover);
                } else {
                    // 파일이 존재하지 않을 경우 기본 이미지 설정
                    console.log('File not found, using default image');
                    book.book_cover = 'default.jpg'; // 기본 이미지 경로 설정
                }
                return book;
            });

            resolve(updatedResults);
        });
    });
};
