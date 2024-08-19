import React, { useState } from 'react';
import Modal from 'react-modal';
import Rating from 'react-rating-stars-component';

// 모달 스타일 설정
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// 모달의 루트 엘리먼트를 설정 (필수)
Modal.setAppElement('#root');

const GetReview = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, review }), // userId 제거
      });

      if (!response.ok) {
        throw new Error('서버 오류');
      }

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('리뷰 제출 실패:', error);
    }

    // 제출 후 모달 닫기
    closeModal();
  };

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
