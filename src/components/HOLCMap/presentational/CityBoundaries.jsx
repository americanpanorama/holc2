import React from 'react';
import PropTypes from 'prop-types';
import { GeoJSON } from 'react-leaflet';

const CitiesBoundaries = ({ boundaries }) => (
  <React.Fragment>
    {boundaries.map(b => (
      <GeoJSON
        data={b.boundaryGeojson}
        weight={b.weight}
        color={b.color}
        fillColor={b.fillColor}
        fillOpacity={b.fillOpacity}
        className="cityBoundary"
        key={b.key}
      />
    ))}
  </React.Fragment>
);

export default CitiesBoundaries;

CitiesBoundaries.propTypes = {
  boundaries: PropTypes.arrayOf(PropTypes.object),
};

CitiesBoundaries.defaultProps = {
  boundaries: [],
};
