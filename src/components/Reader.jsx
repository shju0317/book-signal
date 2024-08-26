import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
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
          onPageMove={onPageMove} // 페이지 이동 기능 연결
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
  const [epubUrl, setEpubUrl] = useState("");
  const [ebooks, setEbooks] = useState([]);

  useEffect(() => {
    // 서버에서 EPUB 파일 목록을 가져옴
    axios.get("http://localhost:3001/ebooks")
      .then(response => {
        setEbooks(response.data);
      })
      .catch(error => {
        console.error("Error fetching ebooks:", error);
      });
  }, []);

  return (
    <Provider store={store}>
      <div>
        {/* EPUB 파일 목록을 렌더링 */}
        <ul>
          {ebooks.map((book) => (
            <li key={book.name}>
              <button onClick={() => setEpubUrl(book.url)}>
                {book.name}
              </button>
            </li>
          ))}
        </ul>

        {/* 선택된 EPUB 파일을 EpubReader에 전달 */}
        {epubUrl && <EpubReader url={epubUrl} />}
      </div>
    </Provider>
  );
};

export default Reader;
