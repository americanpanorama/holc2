import React from 'react';
import PropTypes from 'prop-types';

const BringMapToFrontButton = ({ disabled, action }) => {
  if (disabled) {
    return null;
  }

  return (
    <button
      onClick={action}
      className="bringMapToFront"
      type="button"
      title="bring a scanned map to the top"
    >
      Sort Scans
      {/* JSX Comment 
      <svg
        width={20}
        height={20}
      >
        <rect
          x={1}
          y={6}
          width={13}
          height={13}
          stroke={(!disabled) ? 'white' : '#888'}
          strokeWidth="1"
          fill="transparent"
        />
        <rect
          x={6}
          y={1}
          width={13}
          height={13}
          stroke={(!disabled) ? 'white' : '#888'}
          strokeWidth="1"
          fill={(!disabled) ? 'white' : '#888'}
        />
      </svg> */}
    </button>
  );
};

export default BringMapToFrontButton;

BringMapToFrontButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired,
};
