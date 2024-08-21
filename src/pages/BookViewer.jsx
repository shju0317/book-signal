import { useEffect, useRef } from 'react'
import { FaHeadphones } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'
import { Worker, Viewer, LocalizationMap } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

const BookViewer = () => {
  const viewerRef = useRef(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance, bookmarkPluginInstance } = defaultLayoutPluginInstance;
  
  const pageNavigationPluginInstance = pageNavigationPlugin();
  // const { goToNextPage, goToPreviousPage } = pageNavigationPluginInstance;
  
  // const zoomPluginInstance = zoomPlugin();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col'>
      <div className='flex items-center my-2 gap-1 ml-10'>
        <button onClick={()=>{navigate(-1)}}>
          <IoIosArrowBack size={'24px'}/>
          <span className='sr-only'>뒤로가기</span>
        </button>
        <h2 className='text-xl font-semibold'>나의 눈 부신 친구</h2>
        <button className='flex gap-2 items-center bg-secondary py-1 px-4 ml-5 rounded-md'><FaHeadphones />오디오로 듣기</button>
      </div>
      {/* <div className='border w-[900px] h-[700px] m-auto overflow-auto'> */}
      <div className='flex flex-col border w-[900px] h-[700px] m-auto whitespace-nowrap overflow-x-auto overflow-y-hidden'>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className='border-primary-5'>
          <Viewer fileUrl="sample.pdf"
            // ref={viewerRef}
            // localization={ko_KR}
            initialPage={0} // 시작페이지
            theme={{
              theme: 'dark',
            }}
            plugins={[defaultLayoutPluginInstance, pageNavigationPluginInstance]}
            />
        </div>
      </Worker>
    </div>
    </div>
  )
}

export default BookViewer