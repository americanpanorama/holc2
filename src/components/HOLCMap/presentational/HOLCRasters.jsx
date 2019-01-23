import React from 'react';
import PropTypes from 'prop-types';
import { TileLayer } from 'react-leaflet';

const HOLCRasters = ({ maps }) => (
  <React.Fragment>
    { maps.map(m => (
      <TileLayer
        url={m.url}
        minZoom={m.minZoom}
        maxNativeZoom={m.maxZoom}
        maxZoom={22}
        bounds={m.bounds}
        key={`holcRaster-${m.id}`}
      />
    ))}
  </React.Fragment>
);

export default HOLCRasters;

HOLCRasters.propTypes = {
  maps: PropTypes.arrayOf(PropTypes.object),
};

HOLCRasters.defaultProps = {
  maps: [],
};
