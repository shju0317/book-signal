import React from 'react';
import Dropdown from 'components/option/Dropdown';

interface Props {
  gender: string;
  onSelect: (value: string) => void;
}

const TTSVoiceControl: React.FC<Props> = ({ gender, onSelect }) => {
  const voiceOptions: string[] = ['MALE', 'FEMALE'];
  return (
    <Dropdown
      title="Select Voice"
      defaultValue={gender}
      valueList={voiceOptions}
      onSelect={onSelect}
    />
  );
};

export default TTSVoiceControl;
