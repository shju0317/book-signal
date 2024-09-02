import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { useLocation } from "react-router-dom";
import ePub from "epubjs";
// slices
import store from "slices";
import { updateCurrentPage } from "slices/book";

// styles
import "lib/styles/readerStyle.css";

const EpubReader = ({ url }) => {
  const dispatch = useDispatch();
  const viewerRef = useRef(null);
  const bookRef = useRef(null);
  const renditionRef = useRef(null);

  const [fontSize, setFontSize] = useState("100%");
  const [lineHeight, setLineHeight] = useState("1.5");
  const [margin, setMargin] = useState("0");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const [firstVisibleCfi, setFirstVisibleCfi] = useState(null);

  // ePub 책과 렌더링 초기화
  useEffect(() => {
    if (viewerRef.current) {
      const book = ePub(url);
      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        flow: "paginated",
        spread: "none",
      });

      bookRef.current = book;
      renditionRef.current = rendition;

      const updatePageInfo = () => {
        const location = renditionRef.current.currentLocation();
        if (location) {
          const page = location.start.displayed.page;
          const total = location.start.displayed.total-1;

          setCurrentPage(page || 1);
          setTotalPages(total || 1);

          dispatch(updateCurrentPage({ currentPage: page || 1, totalPages: total || 1 }));
        }
      };

      rendition.on("rendered", updatePageInfo);
      rendition.on("relocated", updatePageInfo);

      rendition.display().then(() => updatePageInfo());

      return () => {
        book.destroy();
        rendition.off("rendered", updatePageInfo);
        rendition.off("relocated", updatePageInfo);
      };
    }
  }, [url, dispatch]);

  // 스타일 업데이트
  useEffect(() => {
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
          .then(() => {
            if (firstVisibleCfi) {
              return renditionRef.current.display(firstVisibleCfi);
            }
          })
          .catch((err) => console.error("스타일 업데이트 또는 위치 생성 중 오류:", err));
      }
    }
  }, [fontSize, lineHeight, margin, fontFamily, firstVisibleCfi]);

  // 페이지 이동 핸들러
  const onPageMove = useCallback((type) => {
    if (renditionRef.current) {
      const updateAfterMove = () => {
        const location = renditionRef.current.currentLocation();
        if (location) {
          const page = location.start.displayed.page;
          const total = location.start.displayed.total;

          setCurrentPage(page || 1);
          setTotalPages(total || 1);

          dispatch(updateCurrentPage({ currentPage: page || 1, totalPages: total || 1 }));
        }
      };

      renditionRef.current.off("relocated", updateAfterMove);
      renditionRef.current.on("relocated", updateAfterMove);

      if (type === "PREV") {
        renditionRef.current.prev();
      } else if (type === "NEXT") {
        renditionRef.current.next();
      }
    }
  }, [dispatch]);

  // 북마크 추가 및 제거
  const addBookmark = () => {
    const currentLocation = renditionRef.current.currentLocation();
    if (currentLocation && currentLocation.start) {
      const newBookmarks = [...bookmarks, currentLocation.start.cfi];
      setBookmarks(newBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks)); // 북마크를 로컬 스토리지에 저장
    }
  };

  const goToBookmark = (cfi) => {
    if (renditionRef.current) {
      renditionRef.current.display(cfi).catch((err) => {
        console.error("북마크 이동 중 오류:", err);
      });
    }
  };

  const removeBookmark = (cfi) => {
    const newBookmarks = bookmarks.filter((bookmark) => bookmark !== cfi);
    setBookmarks(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks)); // 업데이트된 북마크를 로컬 스토리지에 저장
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

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* 설정 메뉴 */}
      <div
        style={{
          padding: "10px",
          background: "#f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label>Font Size: </label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            <option value="80%">80%</option>
            <option value="100%">100%</option>
            <option value="120%">120%</option>
            <option value="150%">150%</option>
          </select>

          <label style={{ marginLeft: "10px" }}>Line Height: </label>
          <select
            value={lineHeight}
            onChange={(e) => setLineHeight(e.target.value)}
          >
            <option value="1.2">1.2</option>
            <option value="1.5">1.5</option>
            <option value="1.8">1.8</option>
          </select>

          <label style={{ marginLeft: "10px" }}>Margin: </label>
          <select value={margin} onChange={(e) => setMargin(e.target.value)}>
            <option value="0">0</option>
            <option value="10px">10px</option>
            <option value="20px">20px</option>
            <option value="30px">30px</option>
          </select>

          <label style={{ marginLeft: "10px" }}>Font Family: </label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <div>
          <button
            onClick={addBookmark}
            style={{ padding: "8px", marginRight: "10px" }}
          >
            Add Bookmark
          </button>
          <button
            onClick={() => setBookmarks([])}
            style={{ padding: "8px", backgroundColor: "red", color: "white" }}
          >
            Clear Bookmarks
          </button>
        </div>
      </div>

      {/* 북마크 메뉴 */}
      <div
        style={{
          padding: "10px",
          background: "#f8f8f8",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {bookmarks.map((bookmark, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            <button
              onClick={() => goToBookmark(bookmark)}
              style={{ margin: "5px" }}
            >
              Bookmark {index + 1}
            </button>
            <button
              onClick={() => removeBookmark(bookmark)}
              style={{ margin: "5px", backgroundColor: "red", color: "white" }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ePub 뷰어가 렌더링될 컨테이너 */}
      <div
        ref={viewerRef}
        style={{ width: "100%", height: "60vh", border: "1px solid #ccc" }}
      ></div>

      {/* 페이지 탐색 버튼 및 정보 표시 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          background: "#f0f0f0",
        }}
      >
        <button onClick={() => onPageMove("PREV")}>Previous</button>
        <span>
          Progress: {calculateReadingProgress()}% | Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => onPageMove("NEXT")}>Next</button>
      </div>
    </div>
  );
};

const Reader = () => {
  const location = useLocation();
  const { bookPath } = location.state || {};

  const epubUrl = `book_file/${bookPath}.epub`;
  return (
    <Provider store={store}>
      <EpubReader url={epubUrl} />
    </Provider>
  );
};

export default Reader;
