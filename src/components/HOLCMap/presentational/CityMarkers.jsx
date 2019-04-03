import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Marker } from 'react-leaflet';

const CityMarkers = ({ markers }) => (
  <React.Fragment>
    { markers.map(m => (
      <Marker
        position={m.position}
        key={`cityLabel${m.id}`}
      >
        <Tooltip
          className={`cityLabel class1`}
          direction="center"
          //offset={c.labelOffset}
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
)

export default CityMarkers;

CityMarkers.propTypes = {
  markers: PropTypes.arrayOf(PropTypes.object),
};

CityMarkers.defaultProps = {
  markers: [],
};
