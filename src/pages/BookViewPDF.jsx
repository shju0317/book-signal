import React, { useState, useEffect, useRef } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// PDF.js 워커 파일 로컬로 설정
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';
GlobalWorkerOptions.workerSrc = workerSrc;

const BookViewTest = () => {
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [darkMode, setDarkMode] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = getDocument('/pdf/현진건-운수좋은날+B3356-개벽.pdf');
        const pdfDocument = await loadingTask.promise;
        setPdf(pdfDocument);
        setTotalPages(pdfDocument.numPages);
        renderPage(1, pdfDocument);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [scale, darkMode]);

  const renderPage = async (num, pdfDocument) => {
    try {
      const page = await pdfDocument.getPage(num);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // 배경색 설정
      context.fillStyle = darkMode ? '#333' : '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      renderPage(pageNumber - 1, pdf);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
      renderPage(pageNumber + 1, pdf);
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
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}>
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
      <canvas ref={canvasRef} style={{ border: '1px solid #ddd' }} />
    </div>
  );
};

export default BookViewTest;
