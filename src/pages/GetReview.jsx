import React, { useState } from 'react';
import Modal from 'react-modal';
import Rating from 'react-rating-stars-component';
import '../css/getreview.css';

const GetReview = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  // Modal의 app element를 설정
  Modal.setAppElement('#root');

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = () => {
    console.log('별점:', rating);
    console.log('리뷰:', review);
    closeModal();
  };

  return (
    <div>
      {/* 모달 창 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="리뷰와 별점 남기기"
        className="review-modal"
        overlayClassName="review-modal-overlay"
      >
        <button className="modal-close-button" onClick={closeModal}>X</button>
        <h2 className="modal-title">별점과 리뷰 작성하기</h2>
        <p className="book-title">선우 바보 아니다?</p>

        {/* 별점 컴포넌트 */}
        <div className='rating-container'>
          <Rating
            count={5}
            value={rating}
            onChange={(newRating) => setRating(newRating)}
            size={40}
            activeColor="#ffd700"
          />
        </div>

        {/* 리뷰 입력 필드 */}
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="독서는 어떠셨나요? 리뷰를 작성해주세요 :)"
          rows={4}
          className="review-textarea"
        />

        {/* 제출 버튼 */}
        <button className="submit-button" onClick={handleSubmit}>등록하기</button>
      </Modal>
    </div>
  );
};

export default GetReview;
