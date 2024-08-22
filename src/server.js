const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const path = require('path');

const session = require('express-session');
const app = express();

// 세션 설정
app.use(session({
    secret: 'MyKey', // 원하는 키설정
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 세션 유지 기간 (7일)
    }
}));

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // React 클라이언트의 주소
    credentials: true,
}));

// 정적 파일 제공을 위한 경로 설정
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/', userRoutes);
app.use('/api', searchRoutes);

app.listen(3001, () => {
    console.log('서버 실행: http://localhost:3001');
});
