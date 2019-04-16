import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-leaflet';
import * as L from 'leaflet';

const UserLocation = ({ position, icon }) => {
  if (!position) {
    return null;
  }

  return (
    <Marker
      position={position}
      icon={icon}
      className="userLocation"
    />
  );
};

export default UserLocation;

UserLocation.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  icon: PropTypes.object,
};

UserLocation.defaultProps = {
  position: null,
  icon: L.icon({
    iconUrl: './static/userLocation.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  }),
};
