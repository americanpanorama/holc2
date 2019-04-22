import React from 'react';
import PropTypes from 'prop-types';
import MinimizeButton from '../../Buttons/presentational/Minimize';

const Header = (props) => {
  const {
    slug,
    onCitySelected,
    adId,
    name,
    onStateSelected,
    state,
    showMinimizeButton,
    toggleCityStats,
  } = props;

  if (!name) {
    return null;
  }

  return (
    <h2>
      <a
        href={`http://dsl.richmond.edu/panorama/redlining/#city=${slug}`}
        onClick={() => { onCitySelected(); return false; }}
        id={adId}
      >
        {`${name}, `}
      </a>
      <span
        onClick={onStateSelected}
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
            marginLeft: 20,
          }}
        >
          <MinimizeButton />
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
  showMinimizeButton: PropTypes.bool,
  toggleCityStats: PropTypes.func.isRequired,
};

Header.defaultProps = {
  slug: undefined,
  adId: undefined,
  name: undefined,
  state: undefined,
  showMinimizeButton: undefined,
};

export default Header;
