const express = require('express');
const router = express.Router();
const { rankingBooks } = require('../models/bookDB');

// 랭킹 도서 목록을 가져오는 API 엔드포인트
router.get('/', (req, res) => {
  console.log('됐니?!');
  rankingBooks()
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      console.error('랭킹 도서 목록을 가져오는 중 오류 발생:', error);
      res.status(500).json({ error: '서버 오류' });
    });
});

module.exports = router;
