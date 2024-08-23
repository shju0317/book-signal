const express = require('express');
const router = express.Router();
const { popularBooks, bestBooks, newBooks } = require('../models/bookDB');

// 인기 랭킹 도서 목록
router.get('/popular', (req, res) => {
  popularBooks()
    .then(books => res.json(books))
    .catch(error => {
      console.error('인기 랭킹 도서 목록을 가져오는 중 오류 발생:', error);
      res.status(500).json({ error: '서버 오류' });
    });
});

// 평점 베스트 도서 목록
router.get('/best', (req, res) => {
  bestBooks()
    .then(books => res.json(books))
    .catch(error => {
      console.error('평점 베스트 도서 목록을 가져오는 중 오류 발생:', error);
      res.status(500).json({ error: '서버 오류' });
    });
});

// 신작 도서 목록
router.get('/new', (req, res) => {
  newBooks()
    .then(books => res.json(books))
    .catch(error => {
      console.error('신작 도서 목록을 가져오는 중 오류 발생:', error);
      res.status(500).json({ error: '서버 오류' });
    });
});

module.exports = router;
