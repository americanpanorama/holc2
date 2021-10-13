import * as React from 'react';
import Header from '../../City/containers/Header';
import CityStats from '../../City/presentational/Stats';
import AreaDescription from '../../AreaDescription/containers/AreaDescription';
import Category from '../../AreaDescription/containers/Category';

const DataViewer = ({ show, style, toggleCityStats, buttonLabel }) => {
  if (show && show !== 'showButton') {
    return (
      <div
        id="dataViewer"
        style={style}
        key={`dataViewer-${show}`}
      >
        <Header />

        { (show === 'city') && (
          <CityStats />
        )}

        { (show === 'areaDescription') && (
          <AreaDescription />
        )}

        { (show === 'category') && (
          <Category />
        )}
      </div>
    );
  }

  if (show === 'showButton') {
    return (
      <button
        className="toggle cityStats"
        onClick={toggleCityStats}
        type="button"
      >
        {buttonLabel}
      </button>
    );
  }

  return null;
};

export default DataViewer;
