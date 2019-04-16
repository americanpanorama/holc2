import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Marker } from 'react-leaflet';
import * as L from 'leaflet';

const CityMarkers = ({ markers, icon }) => (
  <React.Fragment>
    { markers.map(m => (
      <Marker
        icon={icon}
        position={m.position}
        key={`cityLabel${m.id}`}
      >
        <Tooltip
          className="cityLabel class1"
          direction="center"
          opacity={1}
          permanent
        >
          <span>
            {m.label}
          </span>
        </Tooltip>
      </Marker>
    ))}

  </React.Fragment>
);

export default CityMarkers;

CityMarkers.propTypes = {
  markers: PropTypes.arrayOf(PropTypes.object),
  icon: PropTypes.object,
};

CityMarkers.defaultProps = {
  markers: [],
  icon: L.icon({
    iconUrl: encodeURI(`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect x='0' y='0' width='1' height='1' fill='transparent' stroke='transparent' /></svg>`).replace('#','%23'),
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  }),
};
