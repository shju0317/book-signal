import React, { useState } from 'react';
import Modal from 'react-modal';
import Rating from 'react-rating-stars-component';

const GetReview = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');



  return (
    <div>
      <h1>별점과 리뷰를 남겨주세요!</h1>
      <button onClick={openModal}>리뷰 남기기</button>

      {/* 모달 창 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="리뷰와 별점 남기기"
      >
        <h2>리뷰와 별점을 남겨주세요</h2>
        
        {/* 별점 컴포넌트 */}
        <Rating
          count={5}
          value={rating}
          onChange={(newRating) => setRating(newRating)}
          size={40}
          activeColor="#ffd700"
        />

        {/* 리뷰 입력 필드 */}
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="리뷰를 입력하세요"
          rows={4}
          style={{ width: '100%', marginTop: '10px' }}
        />

        {/* 제출 버튼 */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleSubmit}>제출</button>
          <button onClick={closeModal} style={{ marginLeft: '10px' }}>
            닫기
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GetReview;
