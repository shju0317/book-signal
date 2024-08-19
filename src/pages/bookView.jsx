import React from 'react'
import { Worker, Viewer, ScrollMode } from '@react-pdf-viewer/core'
import { useEffect, useRef } from 'react';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

const BookView = () => {
  const viewerRef = useRef(null);
  const pageNavigationPluginInstance = pageNavigationPlugin();

  return (
    <div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div
            style={{
                alignItems: 'center',
                backgroundColor: '#eeeeee',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'center',
                padding: '4px',
            }}
        >
        </div>
        <div
          style={{
              border: '5px solid rgba(0, 0, 0, 0.3)',
              height: '750px',
              width: '1000px',
              overflow: 'auto'
          }}
        >
          <Viewer fileUrl="sample.pdf"  
          ref={viewerRef}
           renderMode="canvas" // 모든 페이지를 캔버스 모드로 렌더링
           initialPage={0} // 처음부터 모든 페이지가 렌더링되도록 설정   
          theme={{
            theme: 'dark',
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          plugins={[pageNavigationPluginInstance]}
          // plugins={[scrollModePluginInstance]} // 스크롤 모드를 활성화
          // scrollMode={ScrollMode.Vertical} // 스크롤 모드 수직 설정
          />
      </div>
      </Worker>
    </div>
  )
}

export default BookView