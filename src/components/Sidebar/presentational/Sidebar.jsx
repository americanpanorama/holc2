import * as React from 'react';
import PropTypes from 'prop-types';

import Header from '../../City/containers/Header';
import HeaderArea from '../../AreaDescription/containers/HeaderArea';
import CityStats from '../../City/presentational/Stats';
import Form19370203Curated from '../../AreaDescription/containers/Form19370203Curated';

const Sidebar = ({ show, style, toggleCityStats, cityName }) => {
  if (show && show !== 'showButton') {
    return (
      <div
        className="sidebar"
        style={style}
      >
        { (show === 'city' || show === 'areaDescriptionCurated') && (
          <Header />
        )}

        { (show === 'city') && (
          <CityStats />
        )}

        { (show === 'areaDescriptionCurated') && (
          <React.Fragment>
            <HeaderArea />
            <Form19370203Curated />
          </React.Fragment>
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
