import React, { useState, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ReactEpubViewer } from "react-epub-viewer"; // Import your component
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
import LoadingView from "LoadingView";
// slices
import store from "slices";
import { updateBook, updateCurrentPage, updateToc } from "slices/book";
// hooks
import useMenu from "lib/hooks/useMenu";
import useHighlight from "lib/hooks/useHighlight";
// styles
import "lib/styles/readerStyle.css";
import viewerLayout from "lib/styles/viewerLayout";

const EpubReader = ({ url }) => {
  const dispatch = useDispatch();
  const currentLocation = useSelector((state) => state.book.currentLocation);

  const viewerRef = useRef(null);
  const navRef = useRef(null);
  const optionRef = useRef(null);
  const learningRef = useRef(null);

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

  const [navControl, onNavToggle] = useMenu(navRef, 300);
  const [optionControl, onOptionToggle, emitEvent] = useMenu(optionRef, 300);
  const [learningControl, onLearningToggle] = useMenu(learningRef, 300);
  const {
    selection,
    onSelection,
    onClickHighlight,
    onAddHighlight,
    onRemoveHighlight,
    onUpdateHighlight,
  } = useHighlight(viewerRef, setIsContextMenu, bookStyle, bookOption.flow);

  const onBookInfoChange = (book) => dispatch(updateBook(book));

  const onLocationChange = (loc) => {
    viewerRef.current && viewerRef.current.setLocation(loc);
  };

  const onPageMove = (type) => {
    const node = viewerRef.current;
    if (node) {
      type === "PREV" ? node.prevPage() : node.nextPage();
    }
  };

  const onTocChange = (toc) => dispatch(updateToc(toc));
  const onBookStyleChange = (bookStyle_) => setBookStyle(bookStyle_);
  const onBookOptionChange = (bookOption_) => setBookOption(bookOption_);

  const onPageChange = (page) => {
    dispatch(updateCurrentPage(page));
    logCurrentPageText(); // 페이지 변경 시 텍스트 로깅
  };

  const onContextMenu = (cfiRange) => {
    const result = onSelection(cfiRange);
    setIsContextMenu(result);
  };

  const onContextMenuRemove = () => setIsContextMenu(false);

  // 특정 페이지의 텍스트를 가져와 콘솔에 출력하는 함수
  const logCurrentPageText = () => {
    const viewer = viewerRef.current;
    if (viewer && viewer.rendition) {
      viewer.rendition.getContents().forEach((content) => {
        const iframeDoc = content.document;
        if (iframeDoc) {
          const text = iframeDoc.body.innerText || iframeDoc.body.textContent;
          console.log("Current Page Text:", text);
        } else {
          console.warn("Could not access iframe content.");
        }
      });
    } else {
      console.warn("Viewer or rendition is not available.");
    }
  };

  return (
    <div>
      <ViewerWrapper>
        <Header
          onNavToggle={onNavToggle}
          onOptionToggle={onOptionToggle}
          onLearningToggle={onLearningToggle}
        />

        <ReactEpubViewer
          url={url}
          viewerLayout={viewerLayout}
          viewerStyle={bookStyle}
          viewerOption={bookOption}
          onBookInfoChange={onBookInfoChange}
          onPageChange={onPageChange}
          onTocChange={onTocChange}
          onSelection={onContextMenu}
          loadingView={<LoadingView />}
          ref={viewerRef}
        />

        <Footer
          title={currentLocation?.chapterName || ""}
          nowPage={currentLocation?.currentPage || 0}
          totalPage={currentLocation?.totalPage || 0}
          onPageMove={onPageMove}
        />
      </ViewerWrapper>

      <Nav
        control={navControl}
        onToggle={onNavToggle}
        onLocation={onLocationChange}
        ref={navRef}
      />

      <Option
        control={optionControl}
        bookStyle={bookStyle}
        bookOption={bookOption}
        bookFlow={bookOption.flow}
        onToggle={onOptionToggle}
        emitEvent={emitEvent}
        onBookStyleChange={onBookStyleChange}
        onBookOptionChange={onBookOptionChange}
        ref={optionRef}
      />

      <Learning
        control={learningControl}
        onToggle={onLearningToggle}
        onClickHighlight={onClickHighlight}
        emitEvent={emitEvent}
        viewerRef={viewerRef}
        ref={learningRef}
      />

      <ContextMenu
        active={isContextMenu}
        viewerRef={viewerRef}
        selection={selection}
        onAddHighlight={onAddHighlight}
        onRemoveHighlight={onRemoveHighlight}
        onUpdateHighlight={onUpdateHighlight}
        onContextMenuRemove={onContextMenuRemove}
      />

      <Snackbar />
    </div>
  );
};

const Reader = () => {
  const epubUrl = "files/카프카 변신 한글번역 200620 05.epub";

  return (
    <Provider store={store}>
      <EpubReader url={epubUrl} />
    </Provider>
  );
};

export default Reader;
