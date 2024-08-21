const db = require('../config/database'); // 데이터베이스 연결 설정

// 회원가입 함수
exports.join = (data) => {
    return new Promise((resolve, reject) => {
        console.log(data); // 데이터 로그 출력

        // 평문 비밀번호를 데이터베이스에 저장
        db.query(`INSERT INTO member (mem_id, mem_pw, mem_name, mem_nick, mem_birth, mem_mail, mem_point, enroll_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW())`, 
        [data.mem_id, data.mem_pw, data.mem_name, data.mem_nick, data.mem_birth, data.mem_mail], 
        (err, result) => {
            if (err) {
                console.error('Database Error:', err); // 데이터베이스 에러 출력
                return reject(err);
            }
            resolve(result);
        });
    });
};

// 사용자 정보 조회 함수
exports.getUser = (mem_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM member WHERE mem_id = ?`, [mem_id], (err, result) => {
            if (err) {
                console.error('Database Error:', err); // 데이터베이스 에러 출력
                return reject(err);
            }
            if (result.length === 0) {
                return resolve({ success: false, message: 'User not found' });
            }
            resolve({ success: true, data: result[0] });
        });
    });
};

// 로그인 함수
exports.login = (mem_id, mem_pw) => {
    return new Promise((resolve, reject) => {
        console.log('사용자 아이디:', mem_id, '사용자 비밀번호:', mem_pw); // 데이터 로그 출력

        // 아이디로 사용자 조회
        db.query(`SELECT * FROM member WHERE mem_id = ?`, [mem_id], (err, result) => {
            if (err) {
                console.error('Database Error:', err); // 데이터베이스 에러 출력
                return reject(err);
            }

            // 사용자 존재 확인
            if (result.length === 0) {
                return resolve({ success: false, message: 'Invalid user ID' });
            }

            const user = result[0];

            // 비밀번호 비교
            if (user.mem_pw === mem_pw) {
                // 아이디와 비밀번호 모두 일치
                resolve({ success: true, user });
                console.log('성공');
                
            } else {
                // 비밀번호 불일치
                resolve({ success: false, message: 'Invalid password' });
            }
        });
    });
};
