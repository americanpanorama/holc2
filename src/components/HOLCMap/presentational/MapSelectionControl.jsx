import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../AreaDescription/presentational/Button';

const MapSelectionControl = ({ showOnlyPolygons, showFullMaps, showMosaicMaps }) => {
  return (
    <div className="mapSelectionControl">
        <button

        >
          map options
        </button>

      <ul className="mapOptions">
        <li
          onClick={showFullMaps}
        >
          show HOLC maps
        </li>
        <li
          onClick={showOnlyPolygons}
        >
          hide HOLC maps
        </li>
        <li
          onClick={showMosaicMaps}
        >
          show only graded areas of HOLC maps
        </li>
      </ul>
    </div>
  );
};

export default MapSelectionControl;

MapSelectionControl.propTypes = {
  showOnlyPolygons: PropTypes.func.isRequired,
};
