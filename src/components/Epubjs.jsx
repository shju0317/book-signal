// Epubjs.jsx
import React, { useState, useEffect, useRef } from "react";
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
  const bookRef = useRef(null);
  const renditionRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarks, setBookmarks] = useState([]); // 북마크를 저장합니다.
  const [fontSize, setFontSize] = useState("100%"); // 폰트 크기 상태
  const [lineHeight, setLineHeight] = useState("1.5"); // 줄 간격 상태
  const [margin, setMargin] = useState("0"); // 여백 상태
  const [fontFamily, setFontFamily] = useState("Arial"); // 글꼴 상태

  useEffect(() => {
    if (url && viewerRef.current) {
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

      // 페이지 수를 계산하고 설정합니다.
      const generateLocations = () => {
        book.ready
          .then(() => {
            book.locations.generate().then(() => {
              setTotalPages(book.locations.length());
            });
          })
          .catch((err) => {
            console.error("Error generating locations:", err);
          });
      };

      generateLocations();

      // 페이지가 이동할 때마다 페이지 번호를 업데이트합니다.
      rendition.on("relocated", (location) => {
        if (location.start) {
          const page = book.locations.locationFromCfi(location.start.cfi);
          setCurrentPage(page + 1); // 페이지는 0부터 시작하므로 +1
          dispatch(updateCurrentPage({ currentPage: page + 1, totalPages }));
        }
      });

      // 페이지 크기나 스타일이 변경될 때 페이지 수를 다시 계산합니다.
      const handleResize = () => {
        if (renditionRef.current) {
          renditionRef.current.resize();
          generateLocations();
        }
      };

      window.addEventListener("resize", handleResize);

      // 컴포넌트 언마운트 시 ePub 책을 정리하고 이벤트 리스너를 제거합니다.
      return () => {
        book.destroy();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [url, dispatch]); // url이 변경될 때마다 useEffect가 실행됩니다.

  // 스타일 업데이트 함수
  const updateStyles = () => {
    if (renditionRef.current) {
      renditionRef.current.themes.default({
        body: {
          "font-size": fontSize,
          "line-height": lineHeight,
          "margin": margin,
          "font-family": fontFamily,
        },
      });
      renditionRef.current.themes.fontSize(fontSize);

      // 페이지 수를 다시 계산
      if (bookRef.current) {
        bookRef.current.locations.generate().then(() => {
          setTotalPages(bookRef.current.locations.length());
        }).catch((err) => {
          console.error("Error regenerating locations after style change:", err);
        });
      }
    }
  };

  useEffect(updateStyles, [fontSize, lineHeight, margin, fontFamily]);

  // 이전 페이지로 이동하는 함수
  const goToPreviousPage = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  // 다음 페이지로 이동하는 함수
  const goToNextPage = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  // 북마크 추가 함수
  const addBookmark = () => {
    const currentLocation = renditionRef.current.currentLocation();
    if (currentLocation && currentLocation.start) {
      const newBookmarks = [...bookmarks, currentLocation.start.cfi];
      setBookmarks(newBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks)); // 북마크를 로컬 스토리지에 저장
    }
  };

  // 북마크로 이동하는 함수
  const goToBookmark = (cfi) => {
    if (renditionRef.current) {
      renditionRef.current.display(cfi).catch((err) => {
        console.error("Error displaying bookmark:", err);
      });
    }
  };

  // 북마크 제거 함수
  const removeBookmark = (cfi) => {
    const newBookmarks = bookmarks.filter((bookmark) => bookmark !== cfi);
    setBookmarks(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks)); // 업데이트된 북마크를 로컬 스토리지에 저장
  };

  // 로컬 스토리지에서 북마크를 불러오는 함수
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  // 독서 진행률 계산 함수
  const calculateReadingProgress = () => {
    if (totalPages > 1) {
      return ((currentPage / totalPages) * 100).toFixed(2); // 진행률을 소수점 둘째 자리까지 표시
    }
    return 0;
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
        <button onClick={goToPreviousPage}>Previous</button>
        <span>
          Progress: {calculateReadingProgress()}% | Page {currentPage} of{" "}
          {totalPages}
        </span>
        <button onClick={goToNextPage}>Next</button>
      </div>
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
