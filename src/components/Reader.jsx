import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { ReactEpubViewer } from "react-epub-viewer";
// 추가 컴포넌트와 설정 가져오기
import Header from "containers/Header";
import Footer from "containers/Footer";
import Nav from "containers/menu/Nav";
import Option from "containers/menu/Option";
import Learning from "containers/menu/Note";
import ContextMenu from "containers/commons/ContextMenu";
import Snackbar from "containers/commons/Snackbar";
import ViewerWrapper from "components/commons/ViewerWrapper";
import store from "slices";
import { updateBook, updateCurrentPage, updateToc } from "slices/book";
import useMenu from "lib/hooks/useMenu";
import useHighlight from "lib/hooks/useHighlight";
import "lib/styles/readerStyle.css";
import viewerLayout from "lib/styles/viewerLayout";
import LoadingView from "LoadingView";
import EyeGaze from "pages/EyeGaze";

const EpubReader = ({ url }) => {
  const dispatch = useDispatch();
  const currentLocation = useSelector((state) => state.book.currentLocation);

  const viewerRef = useRef(null);
  const navRef = useRef(null);
  const optionRef = useRef(null);
  const learningRef = useRef(null);
  const saveGazeTimeRef = useRef(null);

  const [isContextMenu, setIsContextMenu] = useState(false);
  const [bookStyle, setBookStyle] = useState({
    fontFamily: "Arial",
    fontSize: 16,
    lineHeight: 1.6,
  });

  const [bookOption, setBookOption] = useState({
    flow: "paginated",
    resizeOnOrientationChange: true,
    spread: "auto",
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
  const onLocationChange = (loc) =>
    viewerRef.current && viewerRef.current.setLocation(loc);

  const onPageMove = (type) => {
    // 시선 추적 정보 저장 함수 연결
    if (saveGazeTimeRef.current) {
      saveGazeTimeRef.current(); // 페이지 이동 전 시선 추적 시간 저장
    }
    
    const node = viewerRef.current;
    if (node) {
      type === "PREV" ? node.prevPage() : node.nextPage();
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

  return (
    <div className="max-w-screen-xl m-auto">
      <ViewerWrapper className="m-auto">
        <Header
          onNavToggle={onNavToggle}
          onOptionToggle={onOptionToggle}
          onLearningToggle={onLearningToggle}
          className="w-full"
        />

        <ReactEpubViewer
        className="max-w-screen-xl bg-slate-500 "
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
          onPageMove={onPageMove} // 페이지 이동
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
      <EyeGaze viewerRef={viewerRef} onSaveGazeTime={(saveGazeTime) => {
        saveGazeTimeRef.current = saveGazeTime;}}/>
    </div>
  );
};

const Reader = () => {
  const epubUrl = "files/카프카_변신.epub"; // EPUB 파일 경로 설정

  return (
    <Provider store={store}>
      <EpubReader url={epubUrl} /> {/* ReaderWrapper 컴포넌트에 URL 전달 */}
    </Provider>
  );
};

export default Reader;
