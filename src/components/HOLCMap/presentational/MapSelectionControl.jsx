import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../AreaDescription/presentational/Button';

const MapSelectionControl = ({ showHOLCMaps, showFullHOLCMaps, showOnlyPolygons, showFullMaps, showMosaicMaps }) => {
  // Declare a new state variable, which we'll call "count"
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="mapSelectionControl">
        <button
          className={(showMenu) ? 'active' : ''}
          onClick={() => { setShowMenu(!showMenu) }}
        >
          map options
        </button>

      {(showMenu) && (
        <ul className="mapOptions">
          <li
            onClick={() => {
              setShowMenu(false);
              showFullMaps();
            }}
          >
            <figure
              className={(showHOLCMaps && showFullHOLCMaps) ? 'selected' : ''}
            >
              <img src='./static/moFull.png' />
              <figcaption>
                full map
              </figcaption>
            </figure>
          </li>
          <li
            onClick={() => {
              setShowMenu(false);
              showMosaicMaps();
            }}
          >
            <figure
              className={(showHOLCMaps && !showFullHOLCMaps) ? 'selected' : ''}
            >
              <img src='./static/moNeighborhoods.png' />
              <figcaption>
                graded areas
              </figcaption>
            </figure>
          </li>
          <li
            onClick={() => {
              setShowMenu(false);
              showOnlyPolygons();
            }}
          >
            <figure
              className={(!showHOLCMaps) ? 'selected' : ''}
            >
              <img src='./static/moPolygons.png' />
              <figcaption>
                polygons
              </figcaption>
            </figure>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MapSelectionControl;

MapSelectionControl.propTypes = {
  showHOLCMaps: PropTypes.bool.isRequired,
  showFullHOLCMaps: PropTypes.bool.isRequired,
  showOnlyPolygons: PropTypes.func.isRequired,
};
