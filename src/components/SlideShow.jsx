import React, { useState, useEffect, useRef } from 'react';

const SlideShow = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(1); 
  const [isAnimating, setIsAnimating] = useState(false);
  const slideRef = useRef();

  const totalSlides = slides.length;

  const handleChangeSlide = (newIndex) => {
    setIsAnimating(true);
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (isAnimating) return;

    handleChangeSlide(currentIndex + 1);

    if (currentIndex === totalSlides) {
      setTimeout(() => {
        slideRef.current.style.transition = 'none';
        setCurrentIndex(1);
        slideRef.current.style.transform = `translateX(-${100}%)`;
      }, 500);
    }
  };

  const goToPrevious = () => {
    if (isAnimating) return;

    handleChangeSlide(currentIndex - 1);

    if (currentIndex === 1) {
      setTimeout(() => {
        slideRef.current.style.transition = 'none';
        setCurrentIndex(totalSlides);
        slideRef.current.style.transform = `translateX(-${totalSlides * 100}%)`;
      }, 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        goToNext();
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [goToNext, currentIndex, isAnimating]);

  useEffect(() => {
    if (isAnimating) {
      slideRef.current.style.transition = 'transform 500ms ease-in-out';
      slideRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, isAnimating]);

  const slidesWithClones = [
    slides[slides.length - 1], 
    ...slides,
    slides[0], 
  ];

  // 줄 바꿈 변환 함수
  const formatDescription = (text) => {
    return text.split('\n').map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="relative h-80 w-full rounded-lg overflow-hidden"> {/* overflow-hidden으로 변경 */}
      <div
        ref={slideRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          width: `${(totalSlides + 2) * 100}%`, // 슬라이드 컨테이너의 전체 너비를 설정
          transform: `translateX(-${currentIndex * (100 / (totalSlides + 2))}%)`, // 슬라이드 이동 설정
        }}
      >
        {slidesWithClones.map((slide, index) => (
          <div 
            key={index} 
            className="w-full flex-shrink-0 flex items-center justify-between px-20"  
            style={{ 
              background: slide.background,  
              height: '100%',
              width: `${100 / (totalSlides + 2)}%`, // 각 슬라이드의 너비를 설정
            }}
          >
            <div className="text-left">
              <h2 className="text-2xl font-bold text-white">{slide.title}</h2>  
              <p className="mt-4 text-base text-white">
                {formatDescription(slide.description)}
              </p> 
              <div className="mt-6 text-gray-300">
                {currentIndex}/{totalSlides}
              </div>
            </div>
            
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="rounded shadow-lg w-64 h-80 object-cover" 
              style={{ 
                position: 'absolute', 
                bottom: '-20px',  
                right: '-20px',   
                zIndex: 10 
              }}
            />
          </div>
        ))}
      </div>

      {/* 왼쪽 화살표 버튼 */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-50 rounded-full text-gray-800 hover:bg-opacity-75 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 오른쪽 화살표 버튼 */}
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-50 rounded-full text-gray-800 hover:bg-opacity-75 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default SlideShow;
