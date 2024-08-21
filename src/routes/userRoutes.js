const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');   // 유저 컨트롤러 가져오기

// 회원가입
router.post('/join', userController.join);

// 로그인   
router.post('/login', userController.login);  

// 이메일 중복 체크
router.get('/check-email', async (req, res) => {
    const { mem_email } = req.query;
  
    try {
      const getUser = await userController.getUserByEmail(mem_email);
      if (getUser.length) {
        return res.json({ exists: true });
      }
      return res.json({ exists: false });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류' });
    }
  });


// 아이디 중복 체크
router.get('/check-id', async (req, res) => {
    const { mem_id } = req.query;
  
    try {
      const getUser = await userController.getUserId(mem_id);
      if (getUser.length) {
        return res.json({ exists: true });
      }
      return res.json({ exists: false });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류' });
    }
  });
  
// 닉네임 중복 체크
router.get('/check-nick', async (req, res) => {
    const { mem_nick } = req.query;
  
    try {
      const getUser = await userController.getUserByNick(mem_nick);
      if (getUser.length) {
        return res.json({ exists: true });
      }
      return res.json({ exists: false });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류' });
    }
  });
  
module.exports = router;