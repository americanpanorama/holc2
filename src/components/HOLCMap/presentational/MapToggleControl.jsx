import * as React from 'react';
import PropTypes from 'prop-types';

const MapToggleControl = ({ visible, toggleMaps, style }) => {
  const className = `toggle ${(!visible) ? 'inactive' : ''}`;
  const label = (!visible) ? 'Show HOLC Maps' : 'Hide HOLC Maps';
  return (
    <button
      className={className}
      style={style}
      onClick={toggleMaps}
      type="button"
    >
      {label}
    </button>
  );
};

export default MapToggleControl;

MapToggleControl.propTypes = {
  visible: PropTypes.bool.isRequired,
  toggleMaps: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
};
