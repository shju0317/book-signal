import React, { useState } from 'react';
import axios from 'axios';

const TtsTest = () => {
  const [text, setText] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleConvert = async () => {
    try {
      // 서버로 텍스트를 전송하여 음성 변환 요청
      const response = await axios.post('http://localhost:3001/tts', { text }, { responseType: 'arraybuffer' });
      
    // Blob 객체를 사용하여 오디오 소스 생성
    const blob = new Blob([response.data], { type: 'audio/mp3' });
    const url = window.URL.createObjectURL(blob);

    setAudioSrc(url); // Blob URL 설정
      
    } catch (error) {
      console.error('TTS 변환 실패:', error);
    }
  };

  return (
    <div>
      <h1>Text to Speech Demo</h1>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="텍스트를 입력하세요"
        rows="5"
        cols="40"
      />
      <br />
      <button onClick={handleConvert}>음성으로 변환</button>
      <br />
      {audioSrc && (
         <audio controls autoPlay>
          <source src={`${audioSrc}`} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default TtsTest;
