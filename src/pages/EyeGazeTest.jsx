import React, { useEffect } from 'react';
import EasySeeSo from 'seeso/easy-seeso';
// import { initializeGazeTracking } from '../utils/gaze';

const EyeGazeTest = () => {
  return (
    <div>
      <h1>Eye Gaze Test</h1>
      <p>Track your gaze here!</p>
      <canvas id="output" style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
    </div>
  );
};

export default EyeGazeTest;
