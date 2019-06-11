import React from 'react';
import PropTypes from 'prop-types';
import { FeatureGroup, CircleMarker, Tooltip } from 'react-leaflet';

const AreaMarkers = ({ labels, fontSize }) => (
  <React.Fragment>
    { labels.map(p => (
      <FeatureGroup
        className="areaMarker"
        key={p.key}
      >
        <CircleMarker
          center={p.point}
          radius={0.1}
          className="neighborhoodLabelBG"
        >
          <Tooltip
            className="neighborhoodLabel"
            direction="center"
            offset={[0, 0]}
            opacity={1}
            permanent
          >
            <span
              style={{
                fontSize,
                color: p.color,
              }}
            >
              <a
                href={`http://dsl.richmond.edu/panorama/redlining/#city=${p.slug}&area=${p.id}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                {p.id}
              </a>
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
  fontSize: PropTypes.number,
};

AreaMarkers.defaultProps = {
  labels: [],
  fontSize: 12,
};
