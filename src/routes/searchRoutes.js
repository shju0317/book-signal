const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search');

// 도서 검색 라우팅 설정
router.get('/search', searchController.searchBooks);

module.exports = router;