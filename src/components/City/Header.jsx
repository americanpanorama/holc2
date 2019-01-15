import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { citySelected } from '../../store/Dispatchers';

const Header = (props) => {
  const {
    slug,
    onCitySelected,
    adId,
    name,
    onStateSelected,
    state,
    toggleCityStats,
  } = props;

  return (
    <h2 className="sidebarTitle">
      <a
        href={`http://dsl.richmond.edu/panorama/redlining/#city=${slug}`}
        onClick={onCitySelected}
        id={adId}
      >
        {`${name},`}
      </a>
      <span
        onClick={onStateSelected}
        id={state}
        role="link"
        tabIndex={0}
      >
        { state }
      </span>

      <span
        onClick={toggleCityStats}
        role="button"
        tabIndex={0}
        style={{
          float: 'right',
          marginLeft: 20,
        }}
      >
        <svg
          width={20}
          height={20}
        >
          <g transform={`translate(${20 / 2} ${20 / 2})`}>
            <circle
              cx={0}
              cy={0}
              r={20 / 2}
              fill="#4B4E6D"
              fillOpacity={1}
            />
            <line
              x1={-5}
              x2={5}
              y1={0}
              y2={0}
              stroke="#ddd"
              strokeWidth={20 / 10}
            />
          </g>
        </svg>
      </span>
    </h2>
  );
};

Header.propTypes = {
  slug: PropTypes.string.isRequired,
  onCitySelected: PropTypes.func.isRequired,
  adId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onStateSelected: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
  toggleCityStats: PropTypes.func.isRequired,
};

const MapStateToProps = (state) => {
  const { slug, id: adId, name, state: theState } = state.selectedCity.data;
  return {
    slug,
    adId: parseInt(adId, 10),
    name,
    state: theState,
  };
};

const MapDispatchToProps = {
  onCitySelected: citySelected,
  onStateSelected: () => { return },
};

export default connect(MapStateToProps, MapDispatchToProps)(Header);
