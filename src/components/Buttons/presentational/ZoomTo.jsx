import React from 'react';
import PropTypes from 'prop-types';

const Minimize = ({ onClick }) => (
  <svg
    width={20}
    height={20}
    onClick={onClick}
    className="closeButton"
  >
    <g transform={`translate(${20 / 2} ${20 / 2}) rotate(90)`}>
      <circle
        cx={0}
        cy={0}
        r={20 / 2}
        fill="#4B4E6D"
        fillOpacity={1}
      />

      <line
        x1={20 / -3}
        x2={20 / 3}
        y1={0}
        y2={0}
        stroke="#ddd"
        strokeWidth={20 / 15}
      />

      <line
        x1={0}
        x2={0}
        y1={20 / -3}
        y2={20 / 3}
        stroke="#ddd"
        strokeWidth={20 / 15}
      />

      <circle
        cx={0}
        cy={0}
        r={20 / 4.5}
        fill="#4B4E6D"
        fillOpacity={1}
        stroke="#ddd"
        strokeWidth={20 / 15}
      />

      <circle
        cx={0}
        cy={0}
        r={20 / 8}
        fill="#ddd"
      />
    </g>
  </svg>
);

export default Minimize;

Minimize.propTypes = {
  onClick: PropTypes.func,
};

Minimize.defaultProps = {
  onClick: () => false,
};
