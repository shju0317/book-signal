import React, { useState, useRef } from 'react';
import TTSToggle from './TTSToggle';
import TTSRateControl from './TTSRateControl';
import TTSVoiceControl from './TTSVoiceControl';

interface Props {
  viewerRef: React.RefObject<any>;
}

const TTSManager: React.FC<Props> = ({ viewerRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [gender, setGender] = useState<string>('MALE');
  const ttsInstanceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleToggle = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
    } else {
      window.speechSynthesis.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (ttsInstanceRef.current) {
      ttsInstanceRef.current.rate = newRate;
    }
  };

  const handleVoiceChange = (newGender: string) => {
    setGender(newGender);
    if (ttsInstanceRef.current) {
      const selectedVoice = window.speechSynthesis.getVoices().find(voice =>
        newGender === 'MALE' ? voice.name.includes('Male') : voice.name.includes('Female')
      );
      if (selectedVoice) {
        ttsInstanceRef.current.voice = selectedVoice;
      }
    }
  };

  const handleTTS = async () => {
    if (viewerRef.current && !isPlaying) {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        const iframeDocument = iframe.contentDocument;
        const text = iframeDocument?.body.innerText;
        if (text) {
          const speech = new SpeechSynthesisUtterance(text);
          speech.lang = 'ko-KR';
          speech.rate = rate;
          const selectedVoice = window.speechSynthesis.getVoices().find(voice =>
            gender === 'MALE' ? voice.name.includes('Male') : voice.name.includes('Female')
          );
          speech.voice = selectedVoice || null;
          speech.onend = () => {
            setIsPlaying(false);
            // 다음 페이지로 넘어가게 하는 로직 추가 가능
          };
          setIsPlaying(true);
          ttsInstanceRef.current = speech;
          window.speechSynthesis.speak(speech);
        }
      }
    }
  };

  return (
    <div>
      <TTSToggle isPlaying={isPlaying} onToggle={handleToggle} onStop={handleStop} />
      <TTSRateControl rate={rate} onChange={handleRateChange} />
      <TTSVoiceControl gender={gender} onSelect={handleVoiceChange} />
    </div>
  );
};

export default TTSManager;
