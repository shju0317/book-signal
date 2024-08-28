import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/mypage.css';
import { VscPreview } from "react-icons/vsc";
import { BsPersonCircle } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { PiHandCoinsDuotone } from "react-icons/pi";
import axios from 'axios';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장하는 상태
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/check-session', { withCredentials: true })
      .then(response => {
        if (response.data.user) {
          setUserInfo(response.data.user);
          return axios.get(`http://localhost:3001/review/${response.data.user.mem_id}`, { withCredentials: true });
        } else {
          throw new Error('로그인되지 않음');
        }
      })
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else if (error.response && error.response.status === 404) {
          console.log('리뷰가 존재하지 않습니다.');
        } else {
          console.error('데이터를 가져오는데 실패했습니다.', error);
        }
      });
  }, [navigate]);

  const handleDeleteUser = () => {
    navigate('/deleteuser'); // 회원탈퇴 페이지로 이동
  };

  const handleDeleteReview = (reviewId) => {
    axios.delete(`http://localhost:3001/review/${reviewId}`)
      .then(() => {
        // 리뷰 삭제 후 상태 업데이트
        setReviews(prevReviews => prevReviews.filter(review => review.end_idx !== reviewId));
        alert('리뷰가 성공적으로 삭제되었습니다.');
      })
      .catch(error => {
        console.error('리뷰 삭제에 실패했습니다.', error);
      });
  };

  if (!userInfo) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="mypage-container">
      <div className="user-info">
        <h2>{userInfo.mem_nick} 님</h2>
        <br />
        <div className='info-group'>
          <BsPersonCircle className='icon' />
          <p>아이디: {userInfo.mem_id}</p>
        </div>
        <br />
        <div className='info-group'>
          <MdEmail className='icon' />
          <p>이메일: {userInfo.email}</p>
        </div>
        <br />
        <div className='info-group'>
          <PiHandCoinsDuotone className='icon' />
          <p>포인트: <span className="points">{userInfo.point}</span>점</p>
        </div>
        <br />
        <button onClick={handleDeleteUser}>회원탈퇴</button>
      </div>
      <div className="review-section">
        <h3>내가 작성한 리뷰</h3>
        <br />
        {reviews.length === 0 ? (
          <div className="review-placeholder">
            <VscPreview className="preview-icon" />
            <br />
            <p>아직 작성된 리뷰가 없어요</p>
            <p>책을 읽고 리뷰를 작성해 포인트를 쌓아보세요!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.end_idx} className="review-item">
                <img src={`/images/${review.book_cover}`} alt={review.book_name} className="book-cover" /> {/* 도서 이미지 */}
                <div className="review-content">
                  <h4>{review.book_name}</h4>
                  <p>★ {review.book_score}</p>
                  <h5>리뷰: {review.book_review}</h5>
                  <button onClick={() => handleDeleteReview(review.end_idx)}>삭제하기</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPage;
