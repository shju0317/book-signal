const express = require('express');
const router = express.Router();
const { getBookPath } = require('../models/bookDB');


router.post('/', async (req, res) => {
    const bookName = decodeURIComponent(req.body.book_name);

    try {
        const bookPath = await getBookPath(bookName);
        if (!bookPath) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ book_path: bookPath });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
