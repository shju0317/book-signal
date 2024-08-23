const express = require('express');
const router = express.Router();
const conn = require('../config/database');

router.post('/wishlist', (req, res) => {
    const { mem_id, book_idx } = req.body;

    if (!mem_id || !book_idx) {
        return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    const sql = `INSERT INTO book_wishlist (mem_id, book_idx) VALUES (?, ?)`;

    conn.query(sql, [mem_id, book_idx], (err, result) => {
        if (err) {
            console.error('도서 찜하기 에러:', err);
            return res.status(500).json({ message: '도서 찜하기에 실패했습니다.' });
        }

        res.status(200).json({ message: '도서가 찜 목록에 추가되었습니다.' });
    });
});

module.exports = router;
