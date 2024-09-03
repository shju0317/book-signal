import {  useDispatch } from "react-redux";
import React, { useState, useRef, useEffect,useCallback } from "react";
import Header from "containers/Header";
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
import viewerLayout from "lib/styles/viewerLayout";
import LoadingView from "LoadingView";
import EyeGaze from "pages/EyeGaze";

const EpubReader = ({ url }) => {
  const dispatch = useDispatch();
  const viewerRef = useRef(null);
  const saveGazeTimeRef = useRef(null);
  const bookRef = useRef(null);
  const renditionRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [gender, setGender] = useState("MALE");
  const [isPaused, setIsPaused] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [isContextMenu, setIsContextMenu] = useState(false);
  const [pageTextArray, setPageTextArray] = useState([]); // 현재 페이지의 모든 텍스트 상태
  const [bookStyle, setBookStyle] = useState({
    fontFamily: "Arial",
    fontSize: 16,
    lineHeight: 1.6,
    marginHorizontal: 50,
    marginVertical: 5,
  });

  const [bookOption, setBookOption] = useState({
    flow: "paginated",
    resizeOnOrientationChange: true,
    spread: "none",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const [fontSize, setFontSize] = useState("100%");
  const [lineHeight, setLineHeight] = useState("1.5");
  const [margin, setMargin] = useState("0");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [firstVisibleCfi, setFirstVisibleCfi] = useState(null);
  const [shouldSaveCfi, setShouldSaveCfi] = useState(true);
  const [currentBookText, setCurrentBookText] = useState('');

  useEffect(() => {
    if (viewerRef.current) {
      setLoading(true); // 로딩 시작
      const book = ePub(url);
      bookRef.current = book;
      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        flow: "paginated",
        spread: "none",
      });

   renditionRef.current = rendition;

      // 페이지 정보 업데이트 함수
      const updatePageInfo = () => {
        const location = renditionRef.current.currentLocation();
        if (location && location.start && location.start.displayed) {
          const page = location.start.displayed.page;
          const total = location.start.displayed.total;

          if (page !== currentPage || total !== totalPages) {
            setCurrentPage(page || 1);
            setTotalPages(total || 1);
            dispatch(updateCurrentPage({ currentPage: page || 1, totalPages: total || 1 }));
          }
          setLoading(false); // 로딩 완료
        }
      };

      rendition.on("rendered", updatePageInfo);
      rendition.on("relocated", updatePageInfo);

      rendition.display().then(() => updatePageInfo());

      // Cleanup 함수에서 TTS 중지 및 이벤트 핸들러 제거
      return () => {
        stopTTS();  // 컴포넌트가 언마운트될 때 TTS를 중지
        book.destroy();
        rendition.off("rendered", updatePageInfo);
        rendition.off("relocated", updatePageInfo);
      };
    }
  }, [url, dispatch]);

  const updateStyles = useCallback(() => {
    setShouldSaveCfi(true);
    if (renditionRef.current) {
      renditionRef.current.themes.default({
        body: {
          "font-size": fontSize,
          "line-height": lineHeight,
          margin: margin,
          "font-family": fontFamily,
        },
      });

      if (bookRef.current) {
        bookRef.current.ready
          .then(() => bookRef.current.locations.generate())
          .catch((err) => console.error("스타일 업데이트 또는 위치 생성 중 오류:", err));
      }
    }
  }, [fontSize, lineHeight, margin, fontFamily]);

  // 페이지 이동 핸들러
  const onPageMove = useCallback((type) => {
    if (saveGazeTimeRef.current) {
      saveGazeTimeRef.current(); // 페이지 이동 전 시선 추적 시간 저장
    }
    
    setShouldSaveCfi(false);
    if (renditionRef.current) {
      setLoading(true); // 페이지 이동 시 로딩 상태로 변경
      const updateAfterMove = () => {
        const location = renditionRef.current.currentLocation();
        if (location) {
          const page = location.start.displayed.page;
          const total = location.start.displayed.total;

          setCurrentPage(page || 1);
          setTotalPages(total || 1);

          dispatch(updateCurrentPage({ currentPage: page || 1, totalPages: total || 1 }));
          setLoading(false); // 페이지 이동 후 로딩 완료
        }
      };

      renditionRef.current.off("relocated", updateAfterMove);
      renditionRef.current.on("relocated", updateAfterMove);

      if (type === "PREV") {
        renditionRef.current.prev().then(() => {
          logCurrentPageText();
        });
      } else if (type === "NEXT") {
        renditionRef.current.next().then(() => {
          logCurrentPageText();
        });
      }
    }
  }, [dispatch]);

  // 페이지에 보이는 텍스트를 배열로 수집하는 함수
  const logCurrentPageText = () => {
    if (renditionRef.current) {
      const contents = renditionRef.current.getContents();

      let allVisibleTexts = []; // 모든 텍스트를 담을 배열

      contents.forEach((content) => {
        const iframeDoc = content.document;
        if (iframeDoc) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                allVisibleTexts.push(
                  entry.target.innerText || entry.target.textContent
                );
              }
            });

            setPageTextArray(allVisibleTexts);

            const combinedText = allVisibleTexts.join(' ');
            setCurrentBookText(combinedText);

            console.log("All Visible Texts on Current Page:", allVisibleTexts);
          });

          const textElements = iframeDoc.querySelectorAll(
            "p, span, div, h1, h2, h3, h4, h5, h6"
          );
          textElements.forEach((element) => observer.observe(element));
        } else {
          console.warn("Could not access iframe content.");
        }
      });
    } else {
      console.warn("Rendition is not available.");
    }
  };

  const addBookmark = () => {
    const currentLocation = renditionRef.current.currentLocation();
    if (currentLocation && currentLocation.start) {
      const newBookmarks = [...bookmarks, currentLocation.start.cfi];
      setBookmarks(newBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    }
  };

  const handleFontChange = (font) => {
    setFontFamily(font);
    updateStyles();
  };

  // 북마크로 이동
  const goToBookmark = (cfi) => {
    if (renditionRef.current) {
      renditionRef.current.display(cfi).catch((err) => {
        console.error("북마크 이동 중 오류:", err);
      });
    }
  };

  // 북마크 제거
  const removeBookmark = (cfi) => {
    const newBookmarks = bookmarks.filter((bookmark) => bookmark !== cfi);
    setBookmarks(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  const calculateReadingProgress = () => {
    if (totalPages > 0 && currentPage > 0) {
      return ((currentPage / totalPages) * 100).toFixed(2);
    }
    return "0.00"; // 페이지 수가 0일 때는 0%로 표시
  };

  // TTS 관련 함수들
  const handleTTS = async () => {
    if (viewerRef.current && !isPlaying) {
      setIsPlaying(true);
      setIsPaused(false);

      for (const text of pageTextArray) {
        console.log("TTS로 읽을 텍스트:", text);
        const textParts = splitText(text);

        for (const part of textParts) {
          await fetch("http://localhost:3001/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: part, rate, gender }),
          })
            .then((response) => response.arrayBuffer())
            .then((audioContent) => {
              const audioBlob = new Blob([audioContent], { type: "audio/mp3" });
              const audioUrl = URL.createObjectURL(audioBlob);
              audioRef.current.src = audioUrl;
              audioRef.current.playbackRate = rate;
              audioRef.current.play();
              console.log("재생중");
              return new Promise((resolve) => {
                audioRef.current.onended = () => resolve();
              });
            });
        }
      }

      setIsPlaying(false);

      if (renditionRef.current) {
        renditionRef.current.next();
      }
    }
  };

  const stopTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      console.log("tts 정지");
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const pauseTTS = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeTTS = () => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    }
  };

  function splitText(text, maxBytes = 5000) {
    const textParts = [];
    let currentPart = "";

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

  return (
    <div className="max-w-screen-xl m-auto">
      <ViewerWrapper className="m-auto">
        <Header
          onTTSResume={resumeTTS}
          onTTSToggle={handleTTS}
          onTTSPause={pauseTTS}
          onTTSStop={stopTTS}
          onRateChange={setRate}
          onVoiceChange={setGender}
          onBookmarkAdd={addBookmark} // 북마크 추가 핸들러 전달
          onFontChange={handleFontChange} // 폰트 변경 핸들러 전달
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

      <Nav
        control={() => {}}
        onToggle={() => {}}
        onLocation={() => {}}
        ref={null}
      />

      <Snackbar />
      <EyeGaze 
        viewerRef={viewerRef} 
        onSaveGazeTime={(saveGazeTime) => {
        saveGazeTimeRef.current = saveGazeTime;}}
        bookText={currentBookText}
        />
    </div>
  );
};

const Reader = () => {
  const location = useLocation();
  const { bookPath } = location.state || {};

  const epubUrl = `book_file/${bookPath}.epub`;
  console.log(epubUrl);

  return (
    <Provider store={store}>
      <EpubReader url={epubUrl} />
    </Provider>
  );
};

export default Reader;
