import { useRef } from 'react';
import { EpubViewer, ReactEpubViewer } from 'react-epub-viewer';

const Reader = () => {
  const viewerRef = useRef(null);

  const goToNextPage = () => {
    if (viewerRef.current) {
      viewerRef.current.nextPage();
    }
  };

  const goToPreviousPage = () => {
    if (viewerRef.current) {
      viewerRef.current.prevPage();
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div style={{ position: 'absolute', top: 0, width: '100%', zIndex: 100 }}>
        <button onClick={goToPreviousPage}>Previous</button>
        <button onClick={goToNextPage}>Next</button>
      </div>
      <ReactEpubViewer 
        url={'epub/현진건-운수좋은날+B3356-개벽.epub'}
        ref={viewerRef}
      />
    </div>
  );
}

export default Reader;
