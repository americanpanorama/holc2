import * as React from 'react';
import PropTypes from 'prop-types';

import Header from '../../City/containers/Header';
import CityStats from '../../City/presentational/Stats';
import AreaDescription from '../../AreaDescription/containers/AreaDescription';

const Sidebar = ({ show, style, toggleCityStats, cityName }) => {
  if (show && show !== 'showButton') {
    return (
      <div
        className="sidebar"
        style={style}
      >
        { (show === 'city' || show === 'areaDescription') && (
          <Header />
        )}

        { (show === 'city') && (
          <CityStats />
        )}

        { (show === 'areaDescription') && (
          <AreaDescription />
        )}
      </div>
    );
  }

  if (show === 'showButton') {
    return (
      <button
        className="toggle cityStats"
        //style={props.style}
        onClick={toggleCityStats}
        type="button"
      >
        {`Show info for ${cityName}`}
      </button>
    );
  }

  return null;
};

export default Sidebar;

Sidebar.propTypes = {
  show: PropTypes.string,
  style: PropTypes.shape({
    width: PropTypes.number,
  }).isRequired,
  toggleCityStats: PropTypes.func.isRequired,
  cityName: PropTypes.string,
};

Sidebar.defaultProps = {
  show: null,
  cityName: null,
};
