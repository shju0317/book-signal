const reviewDB = require('../models/reviewDB');

exports.getUserReviews = async (req, res) => {
   const mem_id = req.params.mem_id;
  try {
    const reviews = await reviewDB.getUserReviewsWithBooks(mem_id);
    if (reviews.length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(404).json({ message: '작성된 리뷰가 없습니다.' });
    }
  } catch (err) {
    console.error('리뷰 데이터를 가져오는 중 오류 발생:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 리뷰 삭제 기능
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    await reviewDB.deleteReview(reviewId);
    res.status(200).json({ message: '리뷰가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '리뷰 삭제에 실패했습니다.' });
  }
};
