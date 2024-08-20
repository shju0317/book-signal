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
import FindId from './pages/FindId'
import FindPw from './pages/FindPw'
import NewPw from './pages/NewPw'

function App() {
  return (
    <Routes>
      <Route element={<RootLayout/>}>
        <Route index element={<Home/>}/> 
        <Route path='/mylib' element={<MyLib/>}/> 
        <Route path='/mypage' element={<MyPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/join' element={<Join/>}/>
        <Route path='/chatbot' element={<Chatbot/>}/>
        <Route path="/findid" element={<FindId />} />
        <Route path="/findpw" element={<FindPw />} />
        <Route path="/newpw" element={<NewPw />} /> 
      </Route>
    </Routes>
  );
}

export default App;
