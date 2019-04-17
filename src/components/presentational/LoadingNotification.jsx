import React from 'react';
import PropTypes from 'prop-types';

const LoadingNotification = ({ text }) => {
  if (!text) {
    return null;
  }

  return (
    <div id="loadingNotification">
      {text}
    </div>
  );
};

export default LoadingNotification;

LoadingNotification.propTypes = {
  text: PropTypes.string,
};

LoadingNotification.defaultProps = {
  text: null,
};
