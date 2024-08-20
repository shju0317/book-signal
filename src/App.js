import './App.css';
import Chatbot from './components/Chatbot';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Join from './pages/Join'; // Join 컴포넌트 추가
import FindId from './pages/FindId'
import FindPw from './pages/FindPw'
import NewPw from './pages/NewPw'

function App() {
  return (
    <Router> {/* Router로 전체를 감쌈 */}
      <div className="App">
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Join" element={<Join />} />
          <Route path="/FindId" element={<FindId />} />
          <Route path="/FindPw" element={<FindPw />} />
          <Route path="/NewPw" element={<NewPw />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
