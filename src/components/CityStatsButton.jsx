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
    </button>
  );
};

export default CityStatsButton;

CityStatsButton.propTypes = {

};
