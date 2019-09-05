import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ label, disabled, className, id, action, style, type }) => (
  <button
    onClick={action}
    className={className}
    disabled={disabled}
    type={type}
    style={style}
    id={id}
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
  id: PropTypes.number,
  type: PropTypes.string,
  style: PropTypes.object,
};

Button.defaultProps = {
  className: '',
  disabled: false,
  action: () => false,
  style: {},
  id: null,
  type: 'button'
};
