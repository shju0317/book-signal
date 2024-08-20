import { Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/fonts.css'; 
import Home from './pages/Home';
import MyLib from './pages/MyLib';
import MyPage from './pages/MyPage';
import RootLayout from './pages/RootLayout';
import Login from './pages/Login';
import Join from './pages/Join';
import Chatbot from './components/Chatbot';

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
      </Route>
    </Routes>
  )
}

export default App;
