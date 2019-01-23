 import React from 'react';
import PropTypes from 'prop-types';
import { FeatureGroup, CircleMarker, Tooltip } from 'react-leaflet';

const AreaMarkers = ({ labels }) => (
  <React.Fragment>
    { labels.map(p => (
      <FeatureGroup
        className="areaMarker"
        key={`areaMarker-${p.ad_id}-${p.id}`}
      >
        <CircleMarker
          center={p.point}
          radius={1}
          className="neighborhoodLabelBG"
        >
          <Tooltip
            className="neighborhoodLabel"
            direction="center"
            offset={[0, 0]}
            opacity={1}
            permanent
          >
            <span>
              {p.id}
            </span>
          </Tooltip>
        </CircleMarker>
      </FeatureGroup>
    ))}

  </React.Fragment>
);

export default AreaMarkers;

AreaMarkers.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.object),
};

AreaMarkers.defaultProps = {
  labels: [],
};
