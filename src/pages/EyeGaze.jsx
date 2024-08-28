import React, { useState, useEffect, useRef } from 'react';
import EasySeeSo from 'seeso/easy-seeso';
import axios from 'axios';

const SEESO_API_KEY = process.env.REACT_APP_SEESO_API_KEY;
console.log(SEESO_API_KEY);


const EyeGaze = ({ viewerRef, onSaveGazeTime }) => {
  const canvasRef = useRef(null);
  const seesoRef = useRef(null);
  const gazeTimeRef = useRef(0);
  const [gazeTime, setGazeTime] = useState(0);
  const isGazeInsideRef = useRef(false);
  const startTimeRef = useRef(null);

  /******************** 화면 크기에 맞춰 canvas 크기 조정 ********************/
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const viewer = viewerRef.current;

    if (canvas && viewer) {
      const rect = viewer.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.left = `${rect.left}px`;
      canvas.style.top = `${rect.top}px`;

      // canvas.width = 1260;
      // canvas.height = 800;
      // canvas.style.left = 0;
      // canvas.style.top = 0;

      // 보라색 경계선 추가
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#800080'; // 보라색
      ctx.lineWidth = 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [viewerRef]);


  /******************** 시선 추적 시간 계산 ********************/  
  function showGaze(gazeInfo) {
    if (!gazeInfo || typeof gazeInfo.x === 'undefined' || typeof gazeInfo.y === 'undefined') {
        console.error('Invalid gazeInfo:', gazeInfo);
        return;
    }

    // Gaze 정보를 콘솔에 출력
    // console.log(`[좌표] X: ${gazeInfo.x}, Y: ${gazeInfo.y}`);
    
    const canvas = canvasRef.current;
    // const viewer = document.querySelector('.calibre.main');
    const viewer = document.querySelector('iframe');

    if (canvas && viewer) {
        const rect = viewer.getBoundingClientRect();
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Canvas 내 좌표로 변환
            const x = gazeInfo.x - rect.left;
            const y = gazeInfo.y - rect.top;

            // if (x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height) {
            //     // Gaze 좌표를 캔버스에 표시
            //     ctx.clearRect(0, 0, canvas.width, canvas.height);
            //     ctx.fillStyle = '#FF0000'; // 빨간색
            //     ctx.beginPath();
            //     ctx.arc(x, y, 10, 0, Math.PI * 2, true);
            //     ctx.fill();
            // } else {
            //     console.log('Gaze 좌표가 캔버스 범위를 벗어났습니다.');
            // }
            const isGazeInside = x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height;

            // 시선이 보라색 영역 안에 있는 경우
            if (isGazeInside) {
                if (!isGazeInsideRef.current) {
                    // 시선이 영역에 들어왔을 때 시간을 기록
                    isGazeInsideRef.current = true;
                    startTimeRef.current = Date.now();
                }
            } else {
              if (isGazeInsideRef.current) {
                isGazeInsideRef.current = false;
                if (startTimeRef.current) {
                    const timeSpent = Date.now() - startTimeRef.current;
                    const newGazeTime = gazeTimeRef.current + timeSpent;
                    setGazeTime(newGazeTime);
                    gazeTimeRef.current = newGazeTime; // 최신 gazeTime을 ref에 저장
                    console.log(`보라색 영역에서의 총 시선 머문 시간: ${newGazeTime / 1000}초`);
                    startTimeRef.current = null;
                }
            }
            }

            // Gaze 좌표를 캔버스에 표시
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FF0000'; // 빨간색
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2, true);
            ctx.fill();
        }
    }
}


  /******************** 시선추적 초기화 ********************/  
  function onGaze(gazeInfo) {
    showGaze(gazeInfo);
  }

  function onDebug(FPS, latency_min, latency_max, latency_avg) {
    // Debug 정보를 처리하는 로직
  }

  function afterInitialized() {
    console.log('SDK 초기화 성공!');
    const seeso = seesoRef.current;
    seeso.setMonitorSize(16);
    seeso.setFaceDistance(50);
    seeso.setCameraPosition(window.outerWidth / 2, true);
    seeso.startTracking(onGaze, onDebug);
  }

  function afterFailed() {
    console.log('SDK 초기화 실패!');
  }

  useEffect(() => {
    const initializeSeeso = async () => {
      const seeso = new EasySeeSo();
      seesoRef.current = seeso;

      try {
        await seeso.init(SEESO_API_KEY, afterInitialized, afterFailed);
      } catch (error) {
        console.error('SDK 초기화 중 오류 발생:', error);
      }
    };

    initializeSeeso();

    return () => {
      const seeso = seesoRef.current;
      if (seeso) {
        seeso.stopTracking();
      }
    };
  }, []);

  
  /******************** 시선 추적 시간 저장 ********************/
  // 임의로 지정된 값들(테스트용)
  const bookIdx = 1; 
  const memId = 'zzang';
  const bookText = '텍스트';

const saveGazeTime = () => {

    if (gazeTime > 0) {
        console.log('gazeTime이 0보다 큼:', gazeTime);
        axios.post('http://localhost:3001/gaze', {
            book_idx: bookIdx,
            mem_id: memId,
            book_text: bookText,
            gaze_duration: gazeTime / 1000 // 초 단위로 변환
        })
        .then(response => {
            console.log('gazeTime 저장 성공:', response.data);
            setGazeTime(0);  // 저장 후 시간 초기화
            if (onSaveGazeTime) onSaveGazeTime();
        })
        .catch(error => {
            console.error('gazeTime 저장 실패:', error);
        });
    } else {
        console.log('gazeTime이 0이거나 없음');
    }
};

useEffect(() => {
  if (onSaveGazeTime) {
    onSaveGazeTime(saveGazeTime);
  }
}, [onSaveGazeTime]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute top-0 left-0 z-50 pointer-events-none"></canvas>
    </>
  );
};

export default EyeGaze;
