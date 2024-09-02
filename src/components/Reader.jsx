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
  const bookRef = useRef(null);
  const renditionRef = useRef(null);

  const [currentPage, setCurrentPage] = useState();
  console.log(currentPage);
  
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
        // 페이지 번호와 총 페이지 수를 1씩 증가시켜서 사용자에게 1부터 시작하는 것처럼 보이게 함
        const currentPage = location.start.displayed.page;
        const totalPages = location.start.displayed.total;

        setCurrentPage(currentPage);
        setTotalPages(totalPages);

        // 페이지 번호와 총 페이지 수를 콘솔에 출력
        console.log(`Current Page: ${currentPage}, Total Pages: ${totalPages}`);

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

  return (
    <div>
      <ViewerWrapper>

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

  const epubUrl = `book_file/${bookPath}.epub`;
  console.log(epubUrl);


  return (
    <Provider store={store}>
      <EpubReader url={epubUrl} />
    </Provider>
  );
};

export default Reader;
