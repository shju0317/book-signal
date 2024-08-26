const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const app = express();
const reviewRoutes = require('./routes/reviewRoutes');
const fs = require('fs'); // 파일 시스템 접근을 위한 모듈 추가q1

// 세션 설정 (기본 설정)
app.use(session({
    secret: 'MyKey', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: null // 기본 설정에서는 세션 종료 시 만료
    }
}));

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// 정적 파일 제공을 위한 경로 설정
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// 세션 상태 확인을 위한 엔드포인트
app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: '로그인되지 않음' });
    }
});

// 로컬 경로 설정 (Windows 경로 사용)
const ebookDirectory = 'C:\\Users\\SMHRD\\Desktop\\도서';

// EPUB 파일 목록을 제공하는 엔드포인트 추가
app.get('/ebooks', (req, res) => {
    fs.readdir(ebookDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve books' });
        }
        const ebooks = files.map(file => ({
            name: file,
            url: `http://localhost:3001/ebook/${encodeURIComponent(file)}`
        }));
        res.json(ebooks);
    });
});

// 특정 EPUB 파일을 제공하는 API 추가
app.get('/ebook/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(ebookDirectory, filename);

    // 파일이 존재하는지 확인하고, 존재하면 읽어서 클라이언트에 전송
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.sendFile(filePath); // 파일을 클라이언트에 직접 전송
    });
});

app.use('/', userRoutes);
app.use('/api', searchRoutes);
app.use('/ranking', rankingRoutes);

// eye-gaze
// Cross-Origin Isolation 헤더 설정
app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }));
app.use(helmet.crossOriginEmbedderPolicy({ policy: 'require-corp' }));
  
// 정적 파일 서빙
app.use(express.static('public'));


app.use('/', reviewRoutes);

app.listen(3001, () => {
    console.log('서버 실행: http://localhost:3001');
});
