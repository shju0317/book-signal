const reviewDB = require('../models/reviewDB');

// 리뷰 불러오기
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

exports.addReview = async (req, res) => {
  const { mem_id, book_idx, book_name, book_score, book_review } = req.body;

  if (!mem_id || !book_idx || !book_name || !book_score || !book_review) {
      return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
  }

  try {
      // 리뷰를 book_end 테이블에 저장
      await reviewDB.addReview({
          mem_id,
          book_idx,
          book_name,
          book_score,
          book_review
      });

      // member 테이블의 포인트 15점 증가
      await reviewDB.updateMemberPoints(mem_id, 15);

      res.status(200).json({ message: '리뷰 등록 성공, 포인트가 15점 추가되었습니다.' });
  } catch (err) {
      console.error('리뷰 등록 중 오류:', err);
      res.status(500).json({ message: '리뷰 등록에 실패했습니다.' });
  }
};