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
import { updateBook, updateCurrentPage, updateToc } from "slices/book";

// styles
import "lib/styles/readerStyle.css";

const EpubReader = ({ url }) => {
  const dispatch = useDispatch();
  const viewerRef = useRef(null);
  const bookRef = useRef(null);
  const renditionRef = useRef(null);

  const [isContextMenu, setIsContextMenu] = useState(false);
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

  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const [fontSize, setFontSize] = useState("100%");
  const [lineHeight, setLineHeight] = useState("1.5");
  const [margin, setMargin] = useState("0");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [firstVisibleCfi, setFirstVisibleCfi] = useState(null); // 현재 페이지의 첫 번째 문장의 CFI
  const [shouldSaveCfi, setShouldSaveCfi] = useState(true); // CFI 저장 여부

  useEffect(() => {
    if (viewerRef.current) {
      const book = ePub(url);
      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        flow: bookOption.flow,
        spread: bookOption.spread,
      });

      bookRef.current = book;
      renditionRef.current = rendition;

      // 특정 위치로 이동
      rendition.display().then(() => {
        // 첫 번째 문장의 위치로 이동
        if (firstVisibleCfi) {
          renditionRef.current.display(firstVisibleCfi).catch((err) => {
            console.error(
              "Error displaying first visible CFI after initial load:",
              err
            );
          });
        } else {
          // 페이지가 처음 로드된 후 텍스트를 출력
          logCurrentPageText(); // 첫 번째 페이지 로드 시 텍스트 로깅
        }
      });

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

      rendition.on("relocated", (location) => {
        // 페이지 번호와 총 페이지 수를 1씩 증가시켜서 사용자에게 1부터 시작하는 것처럼 보이게 함
        const currentPage = location.start.displayed.page;
        const totalPages = location.start.displayed.total;

        setCurrentPage(currentPage);
        setTotalPages(totalPages);

        if (shouldSaveCfi) {
          // 페이지가 변경될 때만 CFI 저장
          setFirstVisibleCfi(location.start.cfi);
        }

        // 페이지 번호와 총 페이지 수를 콘솔에 출력
        console.log(`Current Page: ${currentPage}, Total Pages: ${totalPages}`);

        dispatch(updateCurrentPage({ currentPage, totalPages }));

        // 페이지 이동 후 현재 화면에 보이는 텍스트를 로그에 출력
        logCurrentPageText();
      });

      const handleResize = () => {
        setShouldSaveCfi(true); // 크기 변경 시에는 CFI를 저장해야 함
        if (renditionRef.current) {
          renditionRef.current.resize();
          generateLocations().then(() => {
            // 페이지 렌더링이 완료된 후 첫 번째 문장의 위치로 다시 이동
            if (firstVisibleCfi) {
              renditionRef.current.display(firstVisibleCfi).catch((err) => {
                console.error(
                  "Error displaying first visible CFI after resize:",
                  err
                );
              });
            }
          });
        }
      };

      window.addEventListener("resize", handleResize);

      // 컴포넌트 언마운트 시 ePub 책을 정리하고 이벤트 리스너를 제거합니다.
      return () => {
        book.destroy();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [url, dispatch, bookOption, firstVisibleCfi]);

  const updateStyles = () => {
    setShouldSaveCfi(true); // 스타일 변경 시에는 CFI를 저장해야 함
    if (renditionRef.current) {
      renditionRef.current.themes.default({
        body: {
          "font-size": fontSize,
          "line-height": lineHeight,
          margin: margin,
          "font-family": fontFamily,
        },
      });
      renditionRef.current.themes.fontSize(fontSize);

      // 페이지 수를 다시 계산
      if (bookRef.current) {
        bookRef.current.locations
          .generate()
          .then(() => {
            setTotalPages(bookRef.current.locations.length());

            // 페이지 렌더링이 완료된 후 첫 번째 문장의 위치로 다시 이동
            if (firstVisibleCfi) {
              renditionRef.current.display(firstVisibleCfi).catch((err) => {
                console.error(
                  "Error displaying first visible CFI after style change:",
                  err
                );
              });
            }
          })
          .catch((err) => {
            console.error(
              "Error regenerating locations after style change:",
              err
            );
          });
      }
    }
  };

  useEffect(updateStyles, [fontSize, lineHeight, margin, fontFamily]);

  const onPageMove = (type) => {
    setShouldSaveCfi(false); // 페이지를 넘길 때는 CFI를 저장하지 않음
    if (renditionRef.current) {
      if (type === "PREV") {
        renditionRef.current.prev().then(() => {
          logCurrentPageText(); // 이전 페이지로 이동 후 텍스트 로깅
        });
      } else if (type === "NEXT") {
        renditionRef.current.next().then(() => {
          logCurrentPageText(); // 다음 페이지로 이동 후 텍스트 로깅
        });
      }
    }
  };

  const onTocChange = (toc) => dispatch(updateToc(toc));
  const onBookStyleChange = (bookStyle_) => setBookStyle(bookStyle_);
  const onBookOptionChange = (bookOption_) => setBookOption(bookOption_);

  const onPageChange = (page) => {
    dispatch(updateCurrentPage(page));
    logCurrentPageText();
  };

  const onContextMenuRemove = () => setIsContextMenu(false);

  // 현재 보이는 텍스트를 로그에 출력하는 함수
  const logCurrentPageText = () => {
    if (renditionRef.current) {
      const contents = renditionRef.current.getContents();

      contents.forEach((content) => {
        const iframeDoc = content.document;
        if (iframeDoc) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                console.log("Visible Text on Current Page:", entry.target.innerText || entry.target.textContent);
              }
            });
          });

          // 모든 텍스트 요소를 관찰
          const textElements = iframeDoc.querySelectorAll("p, span, div, h1, h2, h3, h4, h5, h6");
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
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks)); // 북마크를 로컬 스토리지에 저장
    }
  };

  const goToBookmark = (cfi) => {
    if (renditionRef.current) {
      renditionRef.current.display(cfi).catch((err) => {
        console.error("Error displaying bookmark:", err);
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
    if (totalPages > 1) {
      return ((currentPage / totalPages) * 100).toFixed(2);
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
        <button onClick={() => onPageMove("PREV")}>Previous</button>
        <span>
          Progress: {calculateReadingProgress()}% | Page {currentPage} of{" "}
          {totalPages}
        </span>
        <button onClick={() => onPageMove("NEXT")}>Next</button>
      </div>
    </div>
  );
};

const Reader = () => {
  const location = useLocation();
  const { bookPath } = location.state || {};

  const epubUrl = `files/무정.epub`;
  console.log(epubUrl);

  return (
    <Provider store={store}>
      <EpubReader url={epubUrl} />
    </Provider>
  );
};

export default Reader;
