const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // React 클라이언트의 주소
    credentials: true,
}));

app.use('/', userRoutes);

app.listen(3001, () => {
    console.log('서버 실행: http://localhost:3001');
});