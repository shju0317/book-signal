const express = require('express');
const router = express.Router();
const bookDB = require('../models/bookDB'); // bookDB 모듈 경로

// 도서 찜하기 처리 API
router.post('/', async (req, res) => {
    const { mem_id, book_idx } = req.body;
    console.log('왜!!', mem_id, book_idx);

    if (!mem_id || !book_idx) {
        return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    try {
        const result = await bookDB.addWishlist(mem_id, book_idx);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('도서 찜하기 실패:', error);
    }
});

module.exports = router;
