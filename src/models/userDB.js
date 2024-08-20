const db = require('../config/database'); // 데이터베이스 연결 설정

// 회원가입 함수                     
exports.join = (data) => {
    return new Promise((resolve, reject) => {
        console.log(data); // 데이터 로그 출력
        db.query(`INSERT INTO member (mem_id, mem_pw, mem_name, mem_nick, mem_birth, mem_mail, mem_point, enroll_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW())`, 
        [data.mem_id, data.mem_pw, data.mem_name, data.mem_nick, data.mem_birth, data.mem_mail], 
        (err, result) => {
            if (err) {
                console.error('Database Error:', err); // 에러 메시지 출력
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


// 사용자 정보 조회 함수
exports.getUser = (mem_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM member WHERE mem_id = ?`, [mem_id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
