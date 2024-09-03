import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가
import Wrapper from 'components/header/Wrapper';
import Layout, { AutoLayout } from 'components/header/Layout';
import ControlBtn from 'components/header/ControlBtn';
import TTSManager from 'components/tts/TTSManager';
import TTSWrapper from 'components/tts/TTSWrapper';

const Header = ({
  rate,
  gender,
  onRateChange,
  onVoiceChange,
  onTTSToggle,
  onTTSPause,
  onTTSStop,
  onTTSResume,
  onBookmarkAdd = () => { },
  onFontChange = () => { },
  setAudioSource,
  book,
}: Props) => {
  const [showTTSSettings, setShowTTSSettings] = useState(false);
  const [showBookmarkSettings, setShowBookmarkSettings] = useState(false);
  const [showFontSettings, setShowFontSettings] = useState(false);

  const navigate = useNavigate(); // useNavigate 훅 초기화

  const handleSoundClick = () => {
    setShowTTSSettings(true);
  };

  const handleTTSSettingsClose = () => {
    setShowTTSSettings(false);
  };

  const handleBookmarkClick = () => {
    setShowBookmarkSettings(!showBookmarkSettings);
  };

  const handleFontClick = () => {
    setShowFontSettings(!showFontSettings);
  };

  // 독서 완료 및 종료 버튼 클릭 시 도서 상세 페이지로 이동하는 함수
  const handleFinishReading = () => {
    if (book) {
      navigate('/detail', { state: { book } });
    } else {
      console.error("Book data is missing, cannot navigate.");
    }
  };


  return (
    <Wrapper>
      <Layout>
        <AutoLayout>
          <div>
            {/* Sound 버튼 */}
            <ControlBtn message="Sound" onClick={handleSoundClick} />

            {/* Bookmark 버튼, Sound 버튼과 동일한 스타일로 적용 */}
            <ControlBtn message="Bookmark" onClick={handleBookmarkClick} />

            {/* Font Settings 버튼 */}
            <ControlBtn message="Font Settings" onClick={handleFontClick} />

            {/* 독서 완료 및 종료 버튼 */}
            <ControlBtn message="독서 완료" onClick={handleFinishReading} />
            <ControlBtn message="독서 종료" onClick={handleFinishReading} />
          </div>
        </AutoLayout>
      </Layout>

      {/* TTS 설정 창 */}
      <TTSWrapper show={showTTSSettings} onClose={handleTTSSettingsClose}>
        <TTSManager
          onTTSToggle={onTTSToggle}
          onTTSStop={onTTSStop}
          onTTSPause={onTTSPause}
          onTTSResume={onTTSResume}
          rate={rate}
          gender={gender}
          onRateChange={onRateChange}
          onVoiceChange={onVoiceChange}
          setAudioSource={setAudioSource}
        />
      </TTSWrapper>

      {/* Bookmark 설정을 위한 모달 또는 드롭다운을 설정할 수 있습니다. */}
      {showBookmarkSettings && (
        <div className="bookmark-settings">
          <button onClick={onBookmarkAdd}>Add Current Page to Bookmarks</button>
        </div>
      )}

      {/* Font 설정 창 */}
      {showFontSettings && (
        <div className="font-settings">
          <button onClick={() => onFontChange('Arial')}>Arial</button>
          <button onClick={() => onFontChange('Georgia')}>Georgia</button>
          <button onClick={() => onFontChange('Times New Roman')}>Times New Roman</button>
          <button onClick={() => onFontChange('Courier New')}>Courier New</button>
        </div>
      )}
    </Wrapper>
  );
}

interface Props {
  onNavToggle: (value?: boolean) => void;
  onOptionToggle: (value?: boolean) => void;
  onLearningToggle: (value?: boolean) => void;
  onTTSToggle?: (settings: { rate: number, gender: 'MALE' | 'FEMALE' }) => void;
  onTTSStop?: () => void;
  onTTSPause?: () => void;
  onTTSResume?: () => void;
  onBookmarkAdd?: () => void;
  onFontChange?: (font: string) => void;
  rate: number;
  gender: 'MALE' | 'FEMALE';
  onRateChange: (rate: number) => void;
  onVoiceChange: (gender: 'MALE' | 'FEMALE') => void;
  setAudioSource: (audioUrl: string) => void;
  book?: { [key: string]: any }; // book 객체의 타입 추가 (적절한 타입으로 수정 가능)
}

export default Header;
