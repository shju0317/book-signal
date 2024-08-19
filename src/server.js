const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const conn = require('../src/services/database'); // 데이터베이스 연결 모듈

const app = express();
const port = 3000;

// Middleware 설정
app.use(cors()); // CORS 설정
app.use(bodyParser.json()); // JSON 형식의 요청 본문 파싱

// 리뷰 업데이트 API 엔드포인트
app.post('/api/review', (req, res) => {
    const { userId, rating, review } = req.body;

    // 유효성 검사
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: '유효하지 않은 별점입니다.' });
    }

 // SQL 쿼리문
 const sqlString = 'UPDATE book_end SET book_score = ?, book_review = ? WHERE mem_id = ?';
 const values = [rating, review, 'q']; // 'q'는 mem_id 값으로 변경할 필요가 있을 수 있습니다.
    // 쿼리 실행
    conn.query(sqlString, values, (err, results) => {
        if (err) {
            console.error('리뷰 업데이트 실패:', err);
            return res.status(500).json({ message: '서버 오류' });
        }
        if (results.affectedRows === 0) {
            // 업데이트할 레코드가 없는 경우
            return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '리뷰가 성공적으로 업데이트되었습니다.' });
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
