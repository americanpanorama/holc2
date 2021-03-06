import React from 'react';
import PropTypes from 'prop-types';
import MinimizeButton from '../../Buttons/presentational/Minimize';
import CloseButton from '../../Buttons/presentational/Close';
import ZoomToButton from '../../Buttons/presentational/ZoomTo';

const Header = (props) => {
  const {
    slug,
    onCitySelected,
    adId,
    name,
    onStateSelected,
    state,
    showMinimizeButton,
    showCloseButton,
    toggleCityStats,
    zoomToCity,
    unselectCity,
  } = props;

  if (!name) {
    return null;
  }

  return (
    <h2>
      <a
        href={`http://dsl.richmond.edu/panorama/redlining/#city=${slug}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        id={adId}
      >
        {`${name}, `}
      </a>
      <span
        //onClick={onStateSelected}
        id={state}
        role="link"
        tabIndex={0}
      >
        { state }
      </span>

      { (showMinimizeButton) && (
        <span
          onClick={toggleCityStats}
          role="button"
          tabIndex={0}
          style={{
            float: 'right',
            marginLeft: 10,
          }}
        >
          <MinimizeButton />
        </span>
      )}

      { (showCloseButton) && (
        <span
          onClick={unselectCity}
          role="button"
          tabIndex={0}
          style={{
            float: 'right',
            marginLeft: 10,
          }}
        >
          <CloseButton />
        </span>
      )}

      { (showMinimizeButton) && (
        <span
          onClick={zoomToCity}
          id={adId}
          role="button"
          tabIndex={0}
          style={{
            float: 'right',
            marginLeft: 10,
          }}
        >
          <ZoomToButton />
        </span>
    )}
    </h2>
  );
};

Header.propTypes = {
  slug: PropTypes.string,
  onCitySelected: PropTypes.func.isRequired,
  adId: PropTypes.number,
  name: PropTypes.string,
  onStateSelected: PropTypes.func.isRequired,
  state: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showMinimizeButton: PropTypes.bool,
  toggleCityStats: PropTypes.func.isRequired,
  zoomToCity: PropTypes.func.isRequired,
  unselectCity: PropTypes.func.isRequired,
};

Header.defaultProps = {
  slug: undefined,
  adId: undefined,
  name: undefined,
  state: undefined,
  showMinimizeButton: undefined,
  showCloseButton: false,
};

export default Header;
