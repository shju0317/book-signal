import { Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/fonts.css'; 
import Home from './pages/Home';
import MyLib from './pages/MyLib';
import MyPage from './pages/MyPage';
import RootLayout from './pages/RootLayout';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route element={<RootLayout/>}>
        <Route index element={<Home/>}/> 
        <Route path='/mylib' element={<MyLib/>}/> 
        <Route path='/mypage' element={<MyPage/>}/>
        <Route path='/login' element={<Login/>}/>
      </Route>
    </Routes>
  );
}

export default App;
