import React from 'react';
import PropTypes from 'prop-types';
import { CONTROLS_COLOR } from '../../../../data/constants';

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
      <svg
        width={20}
        height={20}
      >
        <polygon
          points="0,-5 8,0, 0,5, -8,0"
          fill={CONTROLS_COLOR}
          transform="translate(10 15)"
          stroke="white"
        />
        <polygon
          points="0,-5 8,0, 0,5, -8,0"
          fill={CONTROLS_COLOR}
          transform="translate(10 10)"
          stroke="white"
        />
        <polygon
          points="0,-5 8,0, 0,5, -8,0"
          fill="white"
          transform="translate(10 5)"
        />

      </svg>
    </button>
  );
};

export default BringMapToFrontButton;

BringMapToFrontButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired,
};
