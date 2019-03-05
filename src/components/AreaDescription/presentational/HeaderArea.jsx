import React from 'react';
import PropTypes from 'prop-types';
import PreviousAreaButton from '../containers/PreviousAreaButton';
import NextAreaButton from '../containers/NextAreaButton';
import CloseButton from '../../Buttons/presentational/Close';

const HeaderArea = ({ holcId, name, unselectArea }) => (
  <header>
    <PreviousAreaButton />
    <NextAreaButton />
    <h3>
      {holcId}
      {(name) ? ` ${name}` : ''}

      <span
        onClick={unselectArea}
        role="button"
        tabIndex={0}
        style={{
          marginLeft: 5,
        }}
      >
        <CloseButton />
      </span>
    </h3>
  </header>
);

export default HeaderArea;

HeaderArea.propTypes = {
  holcId: PropTypes.string.isRequired,
  name: PropTypes.string,
  unselectArea: PropTypes.func.isRequired,
};

HeaderArea.defaultProps = {
  name: undefined,
};
