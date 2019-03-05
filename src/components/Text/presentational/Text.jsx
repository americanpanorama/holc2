import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../AreaDescription/presentational/Button';

const Text = ({ TextComponent, selectText }) => {
  if (!TextComponent) {
    return null;
  }

  return (
    <div id="text">
      <div id="textContent">
        <Button
          label="close"
          className="text"
          action={selectText}
        />
        <TextComponent />
      </div>
    </div>
  );
};

export default Text;

Text.propTypes = {
  TextComponent: PropTypes.func,
  selectText: PropTypes.func.isRequired,
};

Text.defaultProps = {
  TextComponent: null,
};
