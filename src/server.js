require('dotenv').config({ path: './src/tts.env' });
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS); // 환경 변수 출력 확인
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const wishListRoutes = require('./routes/wishListRoutes');
const bookRoutes = require('./routes/bookRoutes');
const mainRoutes = require('./routes/mainRoutes');
const path = require('path');
const helmet = require('helmet');

const session = require('express-session');
const app = express();
const reviewRoutes = require('./routes/reviewRoutes');
const fs = require('fs'); // 파일 시스템 접근을 위한 모듈 추가
const tts = require('./tts'); // TTS 기능 추가

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

app.use('/', userRoutes);
app.use('/api', searchRoutes);
app.use('/ranking', rankingRoutes);
app.use('/wishlist', wishListRoutes);
app.use('/getBookPath', bookRoutes);
app.use('/main', mainRoutes);
app.use('/', reviewRoutes);

// TTS 기능 추가
app.post('/tts', async (req, res) => {
    const { text } = req.body;
    try {
        const audioContent = await tts.convertTextToSpeech(text);

        // 음성 데이터를 클라이언트에 스트림으로 전송
        res.set({
            'Content-Type': 'audio/mp3',
            'Content-Length': audioContent.length,
            'Content-Disposition': 'inline', // 바로 재생
        });

        res.send(audioContent);
    } catch (error) {
        res.status(500).json({ message: 'TTS 변환 실패', error: error.message });
    }
});

;



// eye-gaze
// Cross-Origin Isolation 헤더 설정
app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }));
app.use(helmet.crossOriginEmbedderPolicy({ policy: 'require-corp' }));
  
// 정적 파일 서빙
app.use(express.static('public'));

app.listen(3001, () => {
    console.log('서버 실행: http://localhost:3001');
});
