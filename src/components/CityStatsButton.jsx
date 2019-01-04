import * as React from 'react';
import PropTypes from 'prop-types';

const CityStatsButton = (props) => {
  return (
    <button 
      className='toggle' 
      style={props.style}
      onClick={props.toggleCityStats}
    >
      {`Show info for ${props.name}`}

    {/* JSX Comment 
      <svg
        width={30}
        height={20}
      >
        <g transform={`translate(${20 / 2 + 10} ${20 / 2 + 1})`}>

          <circle
            cx={0}
            cy={0}
            r={20 / 2}
            fill='#ddd'
            strokeWidth={0}
          />
          <line
            x1={0}
            x2={0}
            y1={20 / 4}
            y2={20 / -4}
            stroke='#4B4E6D'
            strokeWidth={20 / 10}
          />
          <line
            x1={20 / -4}
            x2={20 / 4}
            y1={0}
            y2={0}
            stroke='#4B4E6D'
            strokeWidth={20 / 10}
          />
        </g>
      </svg> */}
    </button>
  );
};

export default CityStatsButton;

CityStatsButton.propTypes = {

};
