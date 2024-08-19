// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const conn = require('./services/database'); // 올바른 경로

const app = express();
const port = 3000;

// Middleware 설정
app.use(cors());
app.use(bodyParser.json());

// 리뷰 제출 API 엔드포인트
app.post('/api/review', (req, res) => {
    const { rating, review } = req.body;

    // 유효성 검사
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: '유효하지 않은 별점입니다.' });
    }

    // SQL 쿼리문
    const sqlString = 'UPDATE book_end SET book_score = ?, book_review = ? WHERE mem_id = "q"';
    const values = [rating, review];

    // 쿼리 실행
    conn.query(sqlString, values, (err, results) => {
        if (err) {
            console.error('리뷰 저장 실패:', err);
            return res.status(500).json({ message: '서버 오류' });
        }
        res.status(200).json({ message: '리뷰가 성공적으로 저장되었습니다.' });
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
