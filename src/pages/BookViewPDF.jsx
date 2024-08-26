import React, { useState, useEffect, useRef } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// PDF.js 워커 파일 로컬로 설정
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';
GlobalWorkerOptions.workerSrc = workerSrc;

const BookViewTest = () => {
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [fontSize, setFontSize] = useState(20); // 기본 폰트 크기
  const [darkMode, setDarkMode] = useState(false); // 다크 모드
  const [textContent, setTextContent] = useState(''); // 현재 페이지 텍스트
  const [pageTexts, setPageTexts] = useState([]); // 페이지별 텍스트

  const containerRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = getDocument('/pdf/김유정-동백꽃-조광.pdf');
        const pdfDocument = await loadingTask.promise;
        setPdf(pdfDocument);
        setTotalPages(pdfDocument.numPages);

        // 전체 텍스트 로드
        const texts = [];
        for (let i = 1; i <= pdfDocument.numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const textContent = await page.getTextContent();
          texts.push(textContent.items.map(item => item.str).join(' '));
        }
        setPageTexts(texts);

        // 현재 페이지 텍스트 설정
        renderPage(pageNumber, texts[pageNumber - 1]);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, []);

  useEffect(() => {
    if (pageTexts.length > 0) {
      renderPage(pageNumber, pageTexts[pageNumber - 1]);
    }
  }, [fontSize, pageNumber, pageTexts]);

  const renderPage = (num, text) => {
    try {
      const container = containerRef.current;
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;

      let currentText = '';
      let tempDiv = document.createElement('div');

      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.width = `${containerWidth}px`;
      tempDiv.style.fontSize = `${fontSize}px`;
      tempDiv.style.lineHeight = '2.5';
      tempDiv.style.whiteSpace = 'pre-wrap';
      tempDiv.style.wordWrap = 'break-word';
      document.body.appendChild(tempDiv);

      let lastFittingIndex = 0;

      // 텍스트를 단어 단위로 추가해가면서 컨테이너에 맞는 텍스트 양을 계산
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        tempDiv.innerText = currentText + words[i] + ' ';
        if (tempDiv.clientHeight > containerHeight) {
          break;
        }
        currentText += words[i] + ' ';
        lastFittingIndex = i;
      }

      setTextContent(words.slice(0, lastFittingIndex + 1).join(' '));

      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handleFontSizeIncrease = () => {
    setFontSize(prevSize => prevSize + 2);
  };

  const handleFontSizeDecrease = () => {
    setFontSize(prevSize => Math.max(prevSize - 2, 10)); // 최소 폰트 크기 10px
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'vh',
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#000',
        overflow: 'hidden', // 전체 스크롤 제거
      }}
    >
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          flexShrink: 0, // 헤더 높이 고정
        }}
      >
        <button onClick={handlePrevPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <span> Page {pageNumber} of {totalPages} </span>
        <button onClick={handleNextPage} disabled={pageNumber >= totalPages}>
          Next
        </button>
        <button onClick={handleFontSizeIncrease} style={{ marginLeft: '10px' }}>
          Increase Font Size
        </button>
        <button onClick={handleFontSizeDecrease} style={{ marginLeft: '10px' }}>
          Decrease Font Size
        </button>
        <button onClick={toggleDarkMode} style={{ marginLeft: '10px' }}>
          Toggle Dark Mode
        </button>
      </div>
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'hidden', // 텍스트 영역에서 스크롤 제거
          padding: '0px',
          margin:'20px',
          fontSize: `${fontSize}px`,
          backgroundColor: darkMode ? '#333' : '#fff',
          color: darkMode ? '#fff' : '#000',
          lineHeight: '2.5', // 줄 간격 설정 (필요에 따라 조정)
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'justify', // 텍스트 정렬
        }}
      >
        <p style={{ margin: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
          {textContent}
        </p>
      </div>
    </div>
  );
};

export default BookViewTest;
