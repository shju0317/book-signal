const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const path = require('path');

const app = express();
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
