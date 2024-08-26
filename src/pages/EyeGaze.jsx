import React, { useEffect } from 'react';
import EasySeeSo from 'seeso/easy-seeso';
// import { initializeGazeTracking } from '../utils/gaze'; // gaze.js의 경로를 맞게 설정합니다.


const EyeGaze = () => {

  function showGazeDotOnDom (gazeInfo) {
    let canvas = document.getElementById("output")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = '#FF0000'
    ctx.clearRect(0, 0, canvas.width, canvas.height )
    ctx.beginPath();
    ctx.arc(gazeInfo.x, gazeInfo.y, 10, 0, Math.PI * 2, true);
    ctx.fill();
  }

  function showGazeInfoOnDom (gazeInfo) {
    let gazeInfoDiv = document.getElementById("gazeInfo")
    gazeInfoDiv.innerText = `Gaze Information Below
                            \nx: ${gazeInfo.x}
                            \ny: ${gazeInfo.y}
                            `
  }

  function showGaze(gazeInfo) {
    showGazeInfoOnDom(gazeInfo)
    showGazeDotOnDom(gazeInfo)
  }
  
  function onGaze (gazeInfo) {
    showGaze(gazeInfo)
  }

  function onDebug(FPS, latency_min, latency_max, latency_avg){
    // do something with debug info.
  }
  const seeso = new EasySeeSo();

  (async () => {
  
  // Don't forget to enter your license key.
  // await seeso.init('YOUR_LICENSE_KEY', afterInitialized, afterFailed)
   await seeso.init('dev_p1lfr8r55itfre47cfv9w6ojuzra67y6wlggk0tr', () => {
    seeso.setMonitorSize(16);
    seeso.setFaceDistance(50);
    seeso.setCameraPosition(window.outerWidth / 2, true);
    seeso.startTracking(onGaze, onDebug)
    }, afterFailed)
  })()
  
  function afterInitialized () {
     console.log('sdk init success!')
  }
  
  function afterFailed () {
     console.log('sdk init fail!')
  }

  return (
    <div>
      <h1>Eye Gaze</h1>
      <p>Track your gaze here!</p>
      <canvas id="output" style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
      <h2 id="gazeInfo" style={{textAlign:"center" , zIndex:-1}}></h2>
    </div>
  );
};

export default EyeGaze;
