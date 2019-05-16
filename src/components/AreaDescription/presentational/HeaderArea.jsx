import React from 'react';
import PropTypes from 'prop-types';
import PreviousAreaButton from '../containers/PreviousAreaButton';
import NextAreaButton from '../containers/NextAreaButton';
import CloseButton from '../../Buttons/presentational/Close';
import ZoomToButton from '../../Buttons/presentational/ZoomTo';

const HeaderArea = ({ holcId, adId, name, unselectArea, zoomToArea }) => (
  <header>
    <PreviousAreaButton />
    <NextAreaButton />
    <h3>
      {holcId}
      {(name) ? ` ${name}` : ''}

      <span
        onClick={zoomToArea}
        role="button"
        tabIndex={0}
        id={`${adId}-${holcId}`}
        style={{
          marginLeft: 5,
        }}
      >
        <ZoomToButton />
      </span>
      <span
        onClick={unselectArea}
        role="button"
        tabIndex={1}
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
  adId: PropTypes.number.isRequired,
  name: PropTypes.string,
  unselectArea: PropTypes.func.isRequired,
  zoomToArea: PropTypes.func.isRequired,
};

HeaderArea.defaultProps = {
  name: undefined,
};
