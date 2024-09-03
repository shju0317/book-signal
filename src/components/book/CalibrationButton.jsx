import React, { useContext } from 'react';
import EasySeeSo from 'seeso/easy-seeso';
import { AuthContext } from '../App';

const SEESO_API_KEY = process.env.REACT_APP_SEESO_API_KEY;

const CalibrationButton = () => {
  const { user } = useContext(AuthContext);
  const memId = user?.mem_id || null;

  const startCalibration = () => {
    const redirectUrl = window.location.href;
    const calibrationPoint = 5;
    EasySeeSo.openCalibrationPage(SEESO_API_KEY, memId, redirectUrl, calibrationPoint);
  };

  return (
    <button onClick={startCalibration}>
      Start Calibration
    </button>
  );
};

export default CalibrationButton;
s