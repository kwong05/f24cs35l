import React from 'react';
import { useEffect, useState } from 'react';

function ProgressBar({ progress }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (progress >= 0 && progress <= 1) {
      setWidth(progress * 100);
    }
  }, [progress]);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${width}%` }}></div>
      <span></span>
    </div>
  );
}

export default ProgressBar;
