import { Routes, Route } from 'react-router-dom';
import './App.css';
import './css/fonts.css';
import Home from './pages/Home';
import MyLib from './pages/MyLib';
import MyPage from './pages/MyPage';
import RootLayout from './pages/RootLayout';
import Chatbot from './components/Chatbot';
import Login from './pages/Login';
import Join from './pages/Join';
import BookViewTest from './pages/BookViewPDF';
import GetReview from './pages/GetReview';
import ErrorBoundary from './pages/ErrorBoundary';
import FindId from './pages/FindId'
import FindPw from './pages/FindPw'
import NewPw from './pages/NewPw'
import BookViewer from './pages/BookViewer';
import BookViewPDF from './pages/BookViewPDF';
import BookDetail from './pages/BookDetail';
import DeleteUser from './pages/DeleteUser'
import SearchReport from './pages/searchReport';
import RankingBookList from './pages/RankingBookList';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* RootLayout이 적용되는 경로 */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/mylib' element={<MyLib />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/chatbot' element={<Chatbot />} />
          <Route path="/findid" element={<FindId />} />
          <Route path="/findpw" element={<FindPw />} />
          <Route path="/newpw" element={<NewPw />} />
          <Route path="/bookviewtest" element={<BookViewTest />} />
          <Route path='/getreview' element={<GetReview />} />
          <Route path='/deleteuser' element={<DeleteUser />} />
          <Route path='/searchreport' element={<SearchReport />} />

        </Route>

        <Route>
          {/* RootLayout이 적용되지 않는 독립적인 경로 */}
          <Route path='/login' element={<Login />} />
          <Route path='/join' element={<Join />} />
          <Route path="/findid" element={<FindId />} />
          <Route path="/findpw" element={<FindPw />} />
          <Route path="/newpw" element={<NewPw />} />
          <Route path="/bookviewer" element={<BookViewer />} />
          <Route path="/bookviewtest" element={<BookViewPDF />} />
          <Route path="/detail" element={<BookDetail />} />
          <Route path='/getreview' element={<GetReview />} />
          <Route path='/deleteuser' element={<DeleteUser />} />
          <Route path='/searchreport' element={<SearchReport />} />
          <Route path='/ranking' element={<RankingBookList />} />
        </Route>

        {/* RootLayout이 적용되지 않는 독립적인 경로 */}
        <Route path='/login' element={<Login />} />
        <Route path='/join' element={<Join />} />
        <Route path="/findid" element={<FindId />} />
        <Route path="/findpw" element={<FindPw />} />
        <Route path="/newpw" element={<NewPw />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
