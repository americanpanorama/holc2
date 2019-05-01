import React from 'react';
import PropTypes from 'prop-types';
import { GeoJSON } from 'react-leaflet';

const COMPONENT = ({ geojson }) => {
  if (geojson) {
    return (
      <GeoJSON
        data={geojson}
        fillColor="#E8E8E8"
        fillOpacity={1}
        color="grey"
        weight={0.5}
      />
    );
  }

  return null;
};

export default COMPONENT;

COMPONENT.propTypes = {
  geojson: PropTypes.object,
};

COMPONENT.defaultProps = {
  geojson: undefined
};

