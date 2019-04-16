import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../containers/CloseButton';

const Text = ({ TextComponent }) => {
  if (!TextComponent) {
    return null;
  }

  return (
    <div id="text">
      <div id="textContent">
        <CloseButton />
        <TextComponent />
      </div>
    </div>
  );
};

export default Text;

Text.propTypes = {
  TextComponent: PropTypes.func,
};

Text.defaultProps = {
  TextComponent: null,
};
