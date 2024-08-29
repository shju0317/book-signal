import React from 'react';
import Slider from 'components/option/Slider';

const TTSRateControl = ({ rate, onChange }) => {
  return (
    <Slider
      title="TTS Speed"
      minValue={0.5}
      maxValue={2}
      defaultValue={rate}
      step={0.1}
      active={true}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TTSRateControl;
