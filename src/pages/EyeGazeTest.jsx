import React, { useEffect } from 'react';
import EasySeeSo from 'seeso/easy-seeso';
// import { initializeGazeTracking } from '../utils/gaze';

const EyeGazeTest = () => {


  (async () => {
  const seeso = new EasySeeSo();
  // Don't forget to enter your license key.
  // await seeso.init('YOUR_LICENSE_KEY', afterInitialized, afterFailed)
  await seeso.init('dev_p1lfr8r55itfre47cfv9w6ojuzra67y6wlggk0tr', afterInitialized, afterFailed)
  })()
  
  function afterInitialized () {
     console.log('sdk init success!')
  }
  
  function afterFailed () {
     console.log('sdk init fail!')
  }

  return (
    <div>
      <h1>Eye Gaze Test</h1>
      <p>Track your gaze here!</p>
      <canvas id="output" style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
    </div>
  );
};

export default EyeGazeTest;
