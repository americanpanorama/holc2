import React from 'react';
import PropTypes from 'prop-types';
import { Circle } from 'react-leaflet';

const ClickableCities = ({ cities, onCitySelected }) => (
  <React.Fragment>
    { cities.map(c => (
      <Circle
        center={[c.centerLat, c.centerLng]}
        radius={27000}
        id={c.ad_id}
        onClick={onCitySelected}
        key={`clickableMapitem${c.ad_id}`}
        //className="cityCircle"
      />
    ))}
  </React.Fragment>
);

export default ClickableCities;

ClickableCities.propTypes = {
  cities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCitySelected: PropTypes.func.isRequired,
};
