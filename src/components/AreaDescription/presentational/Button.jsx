import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ label, disabled, className, action, style }) => (
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

export default Button;

Button.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  action: PropTypes.func,
  style: PropTypes.object,
};

Button.defaultProps = {
  className: '',
  disabled: false,
  action: () => false,
  style: {},
};
