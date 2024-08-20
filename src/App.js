import './App.css';
import Chatbot from './components/Chatbot';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Join from './pages/Join'; // Join 컴포넌트 추가

function App() {
  return (
    <Router> {/* Router로 전체를 감쌈 */}
      <div className="App">
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Join" element={<Join />} /> {/* Join 경로 설정 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
