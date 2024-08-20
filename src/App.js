import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import MyLib from './pages/MyLib';
import MyPage from './pages/MyPage';
import RootLayout from './pages/RootLayout';
import Logout from './pages/Logout';

function App() {
  return (
    <Routes>
      <Route element={<RootLayout/>}>
        <Route index element={<Home/>}/> 
        <Route path='/mylib' element={<MyLib/>}/> 
        <Route path='/mypage' element={<MyPage/>}/>
        <Route path='/logout' element={<Logout/>}/>
      </Route>
    </Routes>
  );
}

export default App;
