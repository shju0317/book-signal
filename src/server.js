const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 5000;

// 데이터베이스 연결 설정
const conn = mysql.createConnection({
  host: 'project-db-cgi.smhrd.com',
  user: 'book',
  password: '1234',
  port: 3307,
  database: 'book'
});

// 데이터베이스 연결
conn.connect(err => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err);
    return;
  }
  console.log('데이터베이스 연결 성공');
});

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// 리뷰 제출을 처리하는 라우트
app.post('/submit-review', (req, res) => {
  const { rating, review } = req.body;
  const mem_id = req.session.mem_id; // 세션에서 mem_id 가져오기

  if (!mem_id) {
    return res.status(401).send('사용자가 로그인되어 있지 않습니다');
  }

  // 리뷰 데이터가 이미 있는지 확인
  const checkSql = 'SELECT * FROM reviews WHERE mem_id = ?';
  conn.query(checkSql, [mem_id], (err, results) => {
    if (err) {
      console.error('리뷰 조회 오류:', err);
      return res.status(500).send('서버 오류');
    }

    if (results.length > 0) {
      // 리뷰가 이미 있는 경우 업데이트
      const updateSql = 'UPDATE reviews SET rating = ?, review = ? WHERE mem_id = ?';
      conn.query(updateSql, [rating, review, mem_id], (err) => {
        if (err) {
          console.error('리뷰 업데이트 오류:', err);
          return res.status(500).send('서버 오류');
        }
        res.status(200).send('리뷰가 성공적으로 업데이트되었습니다');
      });
    } else {
      // 리뷰가 없는 경우 새로 삽입
      const insertSql = 'INSERT INTO reviews (mem_id, rating, review) VALUES (?, ?, ?)';
      conn.query(insertSql, [mem_id, rating, review], (err) => {
        if (err) {
          console.error('리뷰 삽입 오류:', err);
          return res.status(500).send('서버 오류');
        }
        res.status(200).send('리뷰가 성공적으로 제출되었습니다');
      });
    }
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중`);
});
