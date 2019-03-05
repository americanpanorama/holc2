import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Tooltip, FeatureGroup } from 'react-leaflet';

const ClickableCities = ({ cities, onCitySelected }) => (
  <React.Fragment>
    { cities.map(c => (
      <FeatureGroup key={`clickableMapitem${c.ad_id}`}>
        <Circle
          center={[c.centerLat, c.centerLng]}
          radius={c.radii.total}
          id={c.ad_id}
          onClick={onCitySelected}
          className='cityMarker'
        >
          <Tooltip
            className="cityLabel"
            direction={c.labelDirection}
            offset={c.labelOffset}
            opacity={1}
            permanent
          >
            <span>
              {c.name}
            </span>
          </Tooltip>
        </Circle>
      </FeatureGroup>
    ))}
  </React.Fragment>
);

export default ClickableCities;

ClickableCities.propTypes = {
  cities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCitySelected: PropTypes.func.isRequired,
};
