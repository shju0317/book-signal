import React, { useState, useRef,useEffect,useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { useLocation } from "react-router-dom";
import ePub from "epubjs";
// containers
import Footer from "containers/Footer";
import Nav from "containers/menu/Nav";
import Snackbar from "containers/commons/Snackbar";
// components
import ViewerWrapper from "components/commons/ViewerWrapper";
// slices
import store from "slices";
import { updateCurrentPage } from "slices/book";

// styles
import "lib/styles/readerStyle.css";

const EpubReader = ({ url }) => {
  const dispatch = useDispatch();
  const viewerRef = useRef(null);
  const audioRef = useRef(new Audio()); // audio 객체를 사용하여 초기화
  const navRef = useRef(null);
  const optionRef = useRef(null);
  const learningRef = useRef(null);

  const [isContextMenu, setIsContextMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // TTS 상태 관리
  const [rate, setRate] = useState(1); // TTS 배속 상태 관리
  const [gender, setGender] = useState("MALE"); // TTS 음성 성별 상태 관리
  const [isPaused, setIsPaused] = useState(false); // 일시정지 상태 관리
  const [audioSource, setAudioSource] = useState(null); // 오디오 소스 상태 관리
  const [currentTextIndex, setCurrentTextIndex] = useState(0); // 현재 텍스트 위치를 저장

  const [bookStyle, setBookStyle] = useState({
    fontFamily: "Arial",
    fontSize: 16,
    lineHeight: 1.6,
  });
  const bookRef = useRef(null);
  const renditionRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (viewerRef.current) {
      const book = ePub(url);
      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        flow: "paginated", // 페이지 방식
        spread: "none", // 페이지 확장 없음
      });

      bookRef.current = book;
      renditionRef.current = rendition;

      // 특정 위치로 이동
      rendition.display();

      rendition.on("relocated", (location) => {
        const currentPage = location.start.displayed.page;
        const totalPages = location.start.displayed.total;

        setCurrentPage(currentPage);
        setTotalPages(totalPages);

        dispatch(updateCurrentPage({ currentPage, totalPages }));
      });

      return () => {
        if (bookRef.current) {
          bookRef.current.destroy();
        }
      };
    }
  }, [url, dispatch]);

  const onPageMove = (type) => {
    if (renditionRef.current) {
      if (type === "PREV") {
        renditionRef.current.prev();
      } else if (type === "NEXT") {
        renditionRef.current.next();
      }
    }
  };

  const onTocChange = (toc) => dispatch(updateToc(toc));
  const onBookStyleChange = (bookStyle_) => setBookStyle(bookStyle_);
  const onBookOptionChange = (bookOption_) => setBookOption(bookOption_);
  const onPageChange = (page) => dispatch(updateCurrentPage(page));
  const onContextMenu = (cfiRange) => {
    const result = onSelection(cfiRange);
    setIsContextMenu(result);
  };
  const onContextMenuRemove = () => setIsContextMenu(false);

  function splitText(text, maxBytes = 5000) {
    const textParts = [];
    let currentPart = "";

    // google cloud tts 텍스트 길이 5000바이트 이상일시 오류 - > 텍스트 나누기
    for (const char of text) {
      const charByteLength = new Blob([char]).size;

      if (new Blob([currentPart + char]).size > maxBytes) {
        textParts.push(currentPart);
        currentPart = char;
      } else {
        currentPart += char;
      }
    }

    if (currentPart) {
      textParts.push(currentPart);
    }

    return textParts;
  }

  useEffect(() => {
    // 배속 변경될 때 오디오 설정만 업데이트
    if (audioRef.current) {
      audioRef.current.playbackRate = rate; // 실시간 배속 반영
    }
  }, [rate]); // 배속 또는 성별이 변경될 때만 실행

   // 성별 변경 시 효과 적용
   useEffect(() => {
    if (isPlaying) {
      // 성별 변경 시 현재 재생 중인 오디오를 멈추고, 새로운 설정으로 재생
      stopTTS();
      resumeTTS();
    }
  }, [gender]); // gender가 변경될 때마다 실행

  useEffect(() => {
    if (audioSource && audioRef.current) {
      audioRef.current.src = audioSource;
      audioRef.current.play();
      audioRef.current.playbackRate = rate; // 배속 반영
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, [audioSource]); // 오디오 소스가 변경될 때만 실행

  // TTS 실행 함수
  const handleTTS = async ({ rate, gender }) => {
    if (viewerRef.current && !isPlaying) {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const text = iframeDocument.body.innerText;
        console.log(text);
        if (text) {
          const textParts = splitText(text);
          setIsPlaying(true);
          setIsPaused(false); // 일시정지 상태 해제
          // TTS 요청 및 오디오 재생
         // TTS 요청 및 오디오 재생
         for (const part of textParts) {
          await fetch('http://localhost:3001/tts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: part, rate, gender }),
          })
            .then(response => response.arrayBuffer())
            .then(audioContent => {
              const audioBlob = new Blob([audioContent], { type: 'audio/mp3' });
              const audioUrl = URL.createObjectURL(audioBlob);
              audioRef.current.src = audioUrl;
              audioRef.current.playbackRate = rate; // 배속 반영
              audioRef.current.play();
              console.log('재생중');
              return new Promise((resolve) => {
                audioRef.current.onended = () => resolve();
              });
            });
        }
        setIsPlaying(false);
        viewerRef.current.nextPage();
      }
    }
  }
};

const stopTTS = () => {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0; // 재생 위치를 처음으로
  }
  setIsPlaying(false);
  setIsPaused(false); // 일시정지 상태 해제
};

  const pauseTTS = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause(); // 오디오 일시 정지
      setIsPaused(true); // 일시정지 상태 설정
    }
  };

  const resumeTTS = () => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    }
  };

  return (
    <div>
      <ViewerWrapper>
        <Header
          onNavToggle={onNavToggle}
          onOptionToggle={onOptionToggle}
          onLearningToggle={onLearningToggle}
          onTTSResume={resumeTTS}
          onTTSToggle={handleTTS} // TTS 실행 함수 전달
          onTTSPause={pauseTTS} 
          onTTSStop={stopTTS} 
          onRateChange={setRate}        // TTS 배속 변경 함수 전달
          onVoiceChange={setGender} 
          rate={rate} 
          gender={gender} 
        />

        <div
          ref={viewerRef}
          style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
        />

        <Footer
          title="Chapter Title"
          nowPage={currentPage}
          totalPage={totalPages}
          onPageMove={onPageMove}
        />
      </ViewerWrapper>

      <Nav control={() => { }} onToggle={() => { }} onLocation={() => { }} ref={null} />

      <Snackbar />
    </div>
  );
};

const Reader = () => {
  const location = useLocation();
  const { bookPath } = location.state || {};

  const epubUrl = `${process.env.PUBLIC_URL}/book_file/${bookPath}.epub`;

  return (
    <Provider store={store}>
      <EpubReader url={epubUrl} />
    </Provider>
  );
};

export default Reader;
