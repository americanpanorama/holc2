import React from 'react';
import PropTypes from 'prop-types';
import { GeoJSON } from 'react-leaflet';

const CitiesBoundaries = ({ boundaries, selectCity }) => (
  <React.Fragment>
    {boundaries.map(b => (
      <GeoJSON
        data={b.boundaryGeojson}
        weight={b.weight}
        color={b.color}
        fillColor={b.fillColor}
        fillOpacity={b.fillOpacity}
        className={`cityBoundary ${(b.selectable) && 'selectable'}`}
        onClick={selectCity}
        id={b.adId}
        key={b.key}
      />
    ))}
  </React.Fragment>
);

export default CitiesBoundaries;

CitiesBoundaries.propTypes = {
  boundaries: PropTypes.arrayOf(PropTypes.object),
  selectCity: PropTypes.func.isRequired,
};

CitiesBoundaries.defaultProps = {
  boundaries: [],
};
