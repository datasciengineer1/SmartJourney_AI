import React, { useState } from 'react';
import './InfoTooltip.css';

const InfoTooltip = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="info-tooltip-container">
      <span 
        className="info-icon"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        ℹ️
      </span>
      {isVisible && (
        <div className={`tooltip-content tooltip-${position}`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;