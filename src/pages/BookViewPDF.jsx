import React, { useState, useEffect, useRef } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// PDF.js 워커 파일 로컬로 설정
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';
GlobalWorkerOptions.workerSrc = workerSrc;

const BookViewTest = () => {
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5); // 줌 비율
  const [darkMode, setDarkMode] = useState(false); // 다크 모드
  const [textContent, setTextContent] = useState(''); // 페이지 텍스트
  const containerRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = getDocument('/pdf/현진건-운수좋은날+B3356-개벽.pdf');
        const pdfDocument = await loadingTask.promise;
        setPdf(pdfDocument);
        setTotalPages(pdfDocument.numPages);
        await renderPage(pageNumber, pdfDocument);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [pageNumber, scale, darkMode]);

  const renderPage = async (num, pdfDocument) => {
    try {
      const page = await pdfDocument.getPage(num);
      const viewport = page.getViewport({ scale });

      // 텍스트 추출
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ');
      setTextContent(text);

      // 캔버스는 필요 없으므로 삭제
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

  const handleZoomIn = () => {
    setScale(prevScale => prevScale * 1.2);
  };

  const handleZoomOut = () => {
    setScale(prevScale => prevScale / 1.2);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div
      ref={containerRef}
      style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#000',
        maxWidth: '100vw',
        overflowX: 'auto'
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handlePrevPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <span> Page {pageNumber} of {totalPages} </span>
        <button onClick={handleNextPage} disabled={pageNumber >= totalPages}>
          Next
        </button>
        <button onClick={handleZoomIn} style={{ marginLeft: '10px' }}>
          Zoom In
        </button>
        <button onClick={handleZoomOut} style={{ marginLeft: '10px' }}>
          Zoom Out
        </button>
        <button onClick={toggleDarkMode} style={{ marginLeft: '10px' }}>
          Toggle Dark Mode
        </button>
      </div>
      <div
        style={{
          width: '100%',
          height: 'auto',
          overflowY: 'auto',
          fontSize: `${scale * 16}px` // 폰트 크기 조정
        }}
      >
        <p style={{ margin: 0 }}>{textContent}</p>
      </div>
    </div>
  );
};

export default BookViewTest;
