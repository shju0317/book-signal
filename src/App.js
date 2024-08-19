import './App.css';
import Join from './pages/Join';
import Chatbot from './components/Chatbot';
import GetReview from './pages/GetReview';

function App() {
  return (
    <div className="App">
      <div>프로젝트 시작</div>
      <Join></Join>
      <GetReview></GetReview>
    </div>
  );
}

export default App;
