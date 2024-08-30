import React, { useState, useEffect, useRef, useCallback } from 'react';
import EasySeeSo from 'seeso/easy-seeso';
import axios from 'axios';

const SEESO_API_KEY = process.env.REACT_APP_SEESO_API_KEY;
// console.log(SEESO_API_KEY);


const EyeGaze = ({ viewerRef, onSaveGazeTime }) => {
  const canvasRef = useRef(null);
  const seesoRef = useRef(null);

  const gazeInsideTimeRef = useRef(0);
  const gazeOutsideTimeRef = useRef(0); // 영역 바깥에서 머문 시간

  const isGazeInsideRef = useRef(false);
  const insideTimerRef = useRef(null); // 영역 안에서의 30초 체크를 위한 타이머
  const outsideTimerRef = useRef(null); // 영역 밖에서의 10초 체크를 위한 타이머

  const [insideTimeTotal, setInsideTimeTotal] = useState(0);
  const [gazeTimeOutside, setGazeTimeOutside] = useState(0);

  /******************** 화면 크기에 맞춰 canvas 크기 조정 ********************/
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const viewer = viewerRef.current;

    if (canvas && viewer) {
      const rect = viewer.getBoundingClientRect();
      // 부모 요소의 크기 확인 및 적용
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;  
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.left = `${rect.left}px`;
      canvas.style.top = `${rect.top}px`;
      console.log('canvas 너비: ', canvas.width);
      console.log('canvas 높이: ', canvas.height);
      

      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#800080'; // 보라색
      ctx.lineWidth = 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
  }, [viewerRef]);

  useEffect(() => {
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [viewerRef, resizeCanvas]);


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
          const isGazeInside = x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height;

          if (isGazeInside) {
              if (!isGazeInsideRef.current) {
                  if (gazeOutsideTimeRef.current) {  // 시선이 영역 안으로 들어왔을 때
                      // 시선이 바깥에 머문 시간 계산
                      const outsideDuration = Date.now() - gazeOutsideTimeRef.current;
                      console.log(`영역 밖 머문 시간: ${outsideDuration/1000}초`);
                  }

                  // 타이머 제거 및 바깥 머문 시간 초기화
                  clearInterval(outsideTimerRef.current);
                  outsideTimerRef.current = null;
                  gazeOutsideTimeRef.current = 0;

                  // 시선이 영역 안으로 들어왔을 때의 시간을 기록
                  gazeInsideTimeRef.current = Date.now();
                  isGazeInsideRef.current = true;

                  // 영역 안에서의 30초 체크를 위한 타이머 설정
                  insideTimerRef.current = setTimeout(() => {
                    alert('너무 오래 읽어');
                    clearTimeout(insideTimerRef.current); // 알림 후 타이머 해제
                  }, 30000); // 30초 후에 알림
              }
          } else {
            if (isGazeInsideRef.current) {
              // 시선이 영역 밖으로 나갔을 때 영역 안에 머문 시간을 계산하고 누적
              const timeSpentInside = Date.now() - gazeInsideTimeRef.current;
              setInsideTimeTotal(prevTime => prevTime + timeSpentInside);

              console.log(`영역 안 머문 누적 시간: ${(insideTimeTotal + timeSpentInside) / 1000}초`);

              // 시선이 영역 밖으로 나갔으므로 바깥에 머문 시간 기록 시작
              gazeOutsideTimeRef.current = Date.now();
              isGazeInsideRef.current = false;

              // 안에서의 30초 타이머 제거
              clearTimeout(insideTimerRef.current);
              insideTimerRef.current = null;

              // 10초 체크를 위한 타이머 설정
              outsideTimerRef.current = setInterval(() => {
                const outsideDuration = Date.now() - gazeOutsideTimeRef.current;
                if (outsideDuration >= 10000) { // 10초 이상 머물렀다면
                  alert('집중!');
                  clearInterval(outsideTimerRef.current); // 알림 후 타이머 해제
                }
              }, 1000);
            }
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#FF0000';
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2, true);
          ctx.fill();
      }
  }
}


  /******************** 시선추적 초기화 ********************/  
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

  function onGaze(gazeInfo) {
    if (!gazeInfo || typeof gazeInfo.x === 'undefined' || typeof gazeInfo.y === 'undefined') {
      console.error('Invalid gazeInfo received:', gazeInfo);
      return;
    }

    showGaze(gazeInfo);
  }

  function onDebug(FPS, latency_min, latency_max, latency_avg) {
    // Debug 정보를 처리하는 로직
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
    if (gazeInsideTimeRef.current > 0) {
      const duration = gazeInsideTimeRef.current / 1000; // 초 단위로 변환
      console.log('gazeTime이 0보다 큼:', gazeInsideTimeRef.current);
  
      axios.post('http://localhost:3001/gaze', {
        book_idx: bookIdx,
        mem_id: memId,
        book_text: bookText,
        gaze_duration: duration
      })
      .then(response => {
        console.log('gazeTime 저장 성공:', response.data);
        gazeInsideTimeRef.current = 0;  // 저장 후 시간 초기화
        setInsideTimeTotal(0); // 상태를 0으로 설정
        if (onSaveGazeTime) onSaveGazeTime();
      })
      .catch(error => {
        console.error('gazeTime 저장 실패:', error);
        gazeInsideTimeRef.current = 0;
        setInsideTimeTotal(0);
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
      <canvas ref={canvasRef} className="absolute pointer-events-none"></canvas>
    </>
  );
};

export default EyeGaze;
