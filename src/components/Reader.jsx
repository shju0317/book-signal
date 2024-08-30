import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { useLocation } from "react-router-dom";
import ePub from "epubjs";
// containers
import Header from "containers/Header";
import Footer from "containers/Footer";
import Nav from "containers/menu/Nav";
import Option from "containers/menu/Option";
import Learning from "containers/menu/Note";
import ContextMenu from "containers/commons/ContextMenu";
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
    spread: "none",
  });

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

      // 특정 위치로 이동
      rendition.display();

      rendition.on("relocated", (location) => {
        const startCfi = location.start.cfi;
        const endCfi = location.end.cfi;
        const displayed = location.start.displayed;

        // 페이지 번호를 `displayed.page`와 `displayed.total`로 가져옴
        const currentPage = displayed.page;
        const totalPages = displayed.total;

        console.log("Start CFI:", startCfi);
        console.log("End CFI:", endCfi);
        console.log("Current Page Number:", currentPage);
        console.log("Total Pages:", totalPages);

        setCurrentPage(currentPage);
        setTotalPages(totalPages);

        dispatch(updateCurrentPage({ currentPage, totalPages }));
      });

      return () => {
        book.destroy();
      };
    }
  }, [url, dispatch]);


  const onPageMove = (type) => {
    if (type === "PREV") {
      renditionRef.current.prev();
    } else if (type === "NEXT") {
      renditionRef.current.next();
    }
  };

  return (
    <div>
      <ViewerWrapper>
        <Header
          onNavToggle={() => { }}
          onOptionToggle={() => { }}
          onLearningToggle={() => { }}
        />

        <div
          ref={viewerRef}
          style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
        />

        <Footer
          title="Chapter Title" // 적절한 타이틀로 변경
          nowPage={currentPage}
          totalPage={totalPages}
          onPageMove={onPageMove}
        />
      </ViewerWrapper>

      <Nav
        control={() => { }}
        onToggle={() => { }}
        onLocation={() => { }}
        ref={null}
      />

      <Option
        control={() => { }}
        bookStyle={bookStyle}
        bookOption={bookOption}
        bookFlow={bookOption.flow}
        onToggle={() => { }}
        emitEvent={() => { }}
        onBookStyleChange={setBookStyle}
        onBookOptionChange={setBookOption}
        ref={null}
      />

      <Learning
        control={() => { }}
        onToggle={() => { }}
        onClickHighlight={() => { }}
        emitEvent={() => { }}
        viewerRef={viewerRef}
        ref={null}
      />

      <ContextMenu
        active={isContextMenu}
        viewerRef={viewerRef}
        selection={null}
        onAddHighlight={() => { }}
        onRemoveHighlight={() => { }}
        onUpdateHighlight={() => { }}
        onContextMenuRemove={() => setIsContextMenu(false)}
      />

      <Snackbar />
    </div>
  );
};

const Reader = () => {
  const location = useLocation();
  const { bookPath } = location.state || {};

  // ePub 파일을 public 폴더에서 가져오기
  const epubUrl = `${process.env.PUBLIC_URL}/book_file/${bookPath}.epub`;

  return (
    <Provider store={store}>
      <EpubReader url={epubUrl} />
    </Provider>
  );
};

export default Reader;
