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
import FindId from './pages/FindId';
import FindPw from './pages/FindPw';
import NewPw from './pages/NewPw';
import GetReview from './pages/GetReview';
import DeleteUser from './pages/DeleteUser'
import SearchReport from './pages/searchReport';

function App() {
  return (
    <Routes>
      {/* RootLayout이 적용되는 경로 */}
      <Route element={<RootLayout/>}>
        <Route index element={<Home/>}/> 
        <Route path='/mylib' element={<MyLib/>}/> 
        <Route path='/mypage' element={<MyPage/>}/>
        <Route path='/chatbot' element={<Chatbot/>}/>
        <Route path='/getreview' element={<GetReview />} />
        <Route path='/deleteuser' element={<DeleteUser />} />
        <Route path='/searchreport' element={<SearchReport />} />
        
      </Route>

      {/* RootLayout이 적용되지 않는 독립적인 경로 */}
      <Route path='/login' element={<Login/>}/>
      <Route path='/join' element={<Join/>}/>
      <Route path="/findid" element={<FindId />} />
      <Route path="/findpw" element={<FindPw />} />
      <Route path="/newpw" element={<NewPw />} />
    </Routes>
  );
}

export default App;
