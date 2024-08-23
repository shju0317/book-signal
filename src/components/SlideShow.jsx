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
  }, [currentIndex, isAnimating]);

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

  return (
    <div className="relative h-72 w-full rounded-lg overflow-hidden">
      <div
        ref={slideRef}
        className="absolute inset-0 flex"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slidesWithClones.map((slide, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            style={{
              background: slide.background,  // 인라인 스타일로 배경색 설정
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}>
            <div className="text-center text-white relative">
              <h2 className="text-xl font-bold">{slide.title}</h2>
              <p className="mt-2">{slide.description}</p>
              <img 
                src={slide.image}
                alt={slide.title}
                className="mt-4 rounded shadow-lg w-32 mx-auto"
                style={{
                  position: 'relative',
                  bottom: '-10px' 
                }}
              />
              
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-3 text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-3 text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default SlideShow;
