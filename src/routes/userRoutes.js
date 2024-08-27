const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');   // 유저 컨트롤러 가져오기

// 회원가입
router.post('/join', userController.join);

// 로그인   
router.post('/login', userController.login);

// 로그아웃
router.post('/logout', userController.logout);

// 회원탈퇴
router.post('/deleteuser', userController.deleteUser);

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

// 아이디 찾기
router.post('/find-id', userController.findId);

// 비밀번호 찾기
router.post('/find-password', userController.findPassword);

// 비밀번호 재설정 경로
router.post('/reset-password', userController.resetPassword);

// 최근 읽은 도서 가져오기
router.get('/recent-books', userController.getRecentBooks);

// 찜한 도서 가져오기
router.get('/wishlist-books', userController.getWishlistBooks);

// 완독 도서 가져오기
router.get('/completed-books', userController.getCompletedBooks);

// 독서 기록을 추가하는 라우트
router.post('/add-reading-record', userController.addReadingRecord);

module.exports = router;
