import React from 'react';
import PropTypes from 'prop-types';

const TranscriptionButton = ({ action }) => (
  <button
    onClick={action}
    className="resetView"
    type="button"
    title="set to national view"
  >
    <img
      src="static/us-outline.svg"
      alt="reset to national view"
    />
  </button>
);

export default TranscriptionButton;

TranscriptionButton.propTypes = {
  action: PropTypes.func.isRequired,
};
