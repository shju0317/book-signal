import React, { useState, createContext } from 'react';
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
import FindId from './pages/FindId';
import FindPw from './pages/FindPw';
import NewPw from './pages/NewPw';
import BookViewer from './pages/BookViewer';
import BookViewPDF from './pages/BookViewPDF';
import BookDetail from './pages/BookDetail';
import DeleteUser from './pages/DeleteUser';
import SearchReport from './pages/searchReport';
import RankingBookList from './pages/RankingBookList';
import EyeGazeTest from './pages/EyeGazeTest';

// 로그인 상태를 관리하기 위한 Context 생성
export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // 로그인 상태 관리
  const [user, setUser] = useState(null);  // 로그인한 사용자 정보 관리

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      <ErrorBoundary>
        <Routes>
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
            <Route path='/ranking' element={<RankingBookList />} />
            <Route path="/detail" element={<BookDetail />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/join' element={<Join />} />
          <Route path="/findid" element={<FindId />} />
          <Route path="/findpw" element={<FindPw />} />
          <Route path="/newpw" element={<NewPw />} />
          <Route path="/bookviewer" element={<BookViewer />} />
          <Route path="/bookviewtest" element={<BookViewPDF />} />
          <Route path='/getreview' element={<GetReview />} />
          <Route path='/deleteuser' element={<DeleteUser />} />
          <Route path='/searchreport' element={<SearchReport />} />
          <Route path='/test' element={<EyeGazeTest />} />
        </Routes>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
}

export default App;
