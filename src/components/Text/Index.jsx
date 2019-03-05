import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ children }) => (
  <div id="text">
    {children}
  </div>
);

export default Text;

Text.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
