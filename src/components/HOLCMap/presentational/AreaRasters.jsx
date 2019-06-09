import React from 'react';
import PropTypes from 'prop-types';
import { TileLayer } from 'react-leaflet';

const HOLCRasters = ({ maps }) => (
  <React.Fragment>
    { maps.map(m => (
      <TileLayer
        className="areaRaster"
        url={m.url}
        minZoom={m.minZoom}
        maxNativeZoom={m.maxZoom - 1}
        maxZoom={24}
        bounds={m.bounds}
        key={`areaRaster-${m.id}`}
        zIndex={1000}
        detectRetina
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
