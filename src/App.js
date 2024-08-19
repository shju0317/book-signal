import './App.css';
import GetReview from './pages/GetReview';
import Join from './pages/Join';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="App">
      <div>프로젝트 시작</div>
      <Join></Join>
      <Chatbot></Chatbot>
    </div>
  );
}

export default App;
