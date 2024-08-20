const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');   // 유저 컨트롤러 가져오기
// 회원가입 부분
router.post('/join', userController.join);   
//router.post('/login', userController.login);   

module.exports = router;