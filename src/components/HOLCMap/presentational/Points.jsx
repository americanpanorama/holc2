import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-leaflet';
import * as L from 'leaflet';

const Points = ({ points, icon }) => {
  return (
    <React.Fragment>
        {points.map(point => (
            <Marker
                position={point}
                icon={icon}
                className="userLocation"
                key={`markerFor${point.join('-')}`}
            />
        ))}
    </React.Fragment>
  );
};

export default Points;

Points.propTypes = {
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  icon: PropTypes.object,
};

Points.defaultProps = {
  points: [],
  icon: L.icon({
    iconUrl: './static/userLocation.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  }),
};
