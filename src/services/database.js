const mysql = require('mysql2');

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

module.exports = conn;
