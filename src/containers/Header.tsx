import Wrapper from 'components/header/Wrapper'
import Layout, { AutoLayout } from 'components/header/Layout'
import Logo from 'components/header/Logo'
import ControlBtn from 'components/header/ControlBtn'
import { useState } from 'react'
import TTSManager from 'components/tts/TTSManager'
import TTSWrapper from 'components/tts/TTSWrapper';

const Header = ({
  onNavToggle, 
  onOptionToggle, 
  onLearningToggle,
  rate,
  gender,
  onRateChange,
  onVoiceChange,
  onTTSToggle,
  onTTSPause,
  onTTSStop,
  onTTSResume,
  setAudioSource
}: Props) => {
  const [showTTSSettings, setShowTTSSettings] = useState(false);

  const handleSoundClick = () => {
    setShowTTSSettings(true);
  };

  const handleTTSSettingsClose = () => {
    setShowTTSSettings(false);
  };

  return (
    <Wrapper>
      <Layout>
        <AutoLayout>
          <Logo />
          <div>
            <ControlBtn message="Sound" onClick={handleSoundClick} />
            <ControlBtn message="Contents" onClick={onNavToggle} />
            <ControlBtn message="Setting" onClick={onOptionToggle} />
            <ControlBtn message="Highlights" onClick={onLearningToggle} />
          </div>
        </AutoLayout>
      </Layout>

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
          setAudioSource={setAudioSource} // setAudioSource 함수 전달
        />
      </TTSWrapper>
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
  rate: number;
  gender: 'MALE' | 'FEMALE';
  onRateChange: (rate: number) => void;
  onVoiceChange: (gender: 'MALE' | 'FEMALE') => void;
  setAudioSource: (audioUrl: string) => void;
}

export default Header;
