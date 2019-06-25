import React from 'react';
import PropTypes from 'prop-types';

const SearchIcon = ({ onClick }) => (
  <svg
    width={20}
    height={20}
    onClick={onClick}
    className="closeButton"
  >

    <g transform={`translate(${20 / 2 * 1.5} ${20 / 2 * 1.5}) rotate(315)`}>
      <circle
        cx={0}
        cy={0}
        r={20 / 2 * 1.5}
        fill='silver'
        fillOpacity={1}
      />
      <circle
        cx={0}
        cy={20 * 1.5  * -0.1}
        r={20  * 1.5  * 0.2}
        fill='silver'
        fillOpacity={1}
        stroke='#4B4E6D'
        strokeWidth={20 / 9}
      />
      <line
        x1={0}
        x2={0}
        y1={20  * 1.5  * 0.1}
        y2={20  * 1.5  * 0.4}
        stroke='#4B4E6D'
        strokeWidth={20 / 7}
      />
    </g>
  </svg>
);

export default SearchIcon;

SearchIcon.propTypes = {
  onClick: PropTypes.func,
};

SearchIcon.defaultProps = {
  onClick: () => false,
};
