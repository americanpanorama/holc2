import React from 'react';
import PropTypes from 'prop-types';

const TranscriptionButton = ({ label, disabled, className, action, style }) => (
  <button
    onClick={action}
    className={className}
    disabled={disabled}
    type="button"
    style={style}
  >
    {label}
  </button>
);

export default TranscriptionButton;

TranscriptionButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  style: PropTypes.object,
};

TranscriptionButton.defaultProps = {
  className: '',
  disabled: false,
  style: {},
};
