import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, FeatureGroup, Marker, Polyline } from 'react-leaflet';

const ClickableCities = ({ cities, otherLabels, zoom, onCitySelected }) => (
  <React.Fragment>
    { cities.map(c => (
      <FeatureGroup
        key={`clickableMapitem${c.ad_id}`}
      >
        <Polyline
          positions={[[c.centerLat, c.centerLng], [c.offsetPoint[1], c.offsetPoint[0]]]}
          color="#666"
          weight={1}
        />

        <Marker
          position={[c.offsetPoint[1], c.offsetPoint[0]]}
          icon={c.icon}
          id={c.ad_id}
          onClick={onCitySelected}
          className="cityMarker"
          key={c.markerKey}
        >
          {(c.showLabel) && (
            <Tooltip
              className={`cityLabel class${c.labelClass} ${(zoom <= 3) ? `zoom${zoom}` : ''}`}
              direction={c.labelDirection}
              opacity={1}
              permanent
            >
              <span>
                <a
                  href={`http://dsl.richmond.edu/panorama/redlining/#city=${c.slug}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCitySelected(e); }}
                  id={c.ad_id}
                >
                  {c.name}
                </a>
              </span>
            </Tooltip>
          )}
        </Marker>
      </FeatureGroup>
    ))}

    { otherLabels.map(l => (
      <Marker
        position={l.offsetPoint}
        icon={l.icon}
        key={`markerfor${l.offsetPoint.join('-')}`}
        className="cityLabelMarker"
      >
        <Tooltip
          className={`cityLabel class1`}
          direction={l.direction}
          opacity={1}
          permanent
        >
          <span>
            {l.label}
          </span>
        </Tooltip>
      </Marker>
    ))}
  </React.Fragment>
);

export default ClickableCities;

ClickableCities.propTypes = {
  cities: PropTypes.arrayOf(PropTypes.object).isRequired,
  otherLabels: PropTypes.arrayOf(PropTypes.object),
  zoom: PropTypes.number.isRequired,
  onCitySelected: PropTypes.func.isRequired,
};

ClickableCities.defaultProps = {
  otherLabels: [],
};
