import React from 'react';

const Minimize = () => (
  <svg
    width={20}
    height={20}
  >
    <g transform={`translate(${20 / 2} ${20 / 2})`}>
      <circle
        cx={0}
        cy={0}
        r={20 / 2}
        fill="#4B4E6D"
        fillOpacity={1}
      />
      {[0, 1, 2, 3].map(i => (
        <g
          transform={`rotate(${i * 90 + 45} 0 0)`}
          key={`arrowForAngle${i * 90 + 45}`}
        >
          <line
            x1={-7}
            x2={-2}
            y1={0}
            y2={0}
            stroke="#ddd"
            strokeWidth={1}
          />
          <line
            x1={-7}
            x2={-5.5}
            y1={0}
            y2={-1.5}
            stroke="#ddd"
            strokeWidth={1}
            strokeLinecap="square"
          />
          <line
            x1={-7}
            x2={-5.5}
            y1={0}
            y2={1.5}
            stroke="#ddd"
            strokeWidth={1}
            strokeLinecap="square"
          />
        </g>
      ))}
    </g>
  </svg>
);

export default Minimize;
