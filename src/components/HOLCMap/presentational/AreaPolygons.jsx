import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, GeoJSON } from 'react-leaflet';

const AreaPolygons = ({ polygons, selectArea, highlightArea, unhighlightArea }) => (
  <LayerGroup>
    { polygons.map(p => (
      <GeoJSON
        data={p.area_geojson}
        className={`neighborhoodPolygon`}
        onClick={selectArea}
        onMouseOver={highlightArea}
        onMouseOut={unhighlightArea}
        id={`${p.ad_id}-${p.id}`}
        color={p.strokeColor}
        fillColor={p.fillColor}
        fillOpacity={p.fillOpacity}
        opacity={p.strokeOpacity}
        weight={p.weight}
        style={p.style}
        key={p.key}
      />
    ))}
  </LayerGroup>
);

export default AreaPolygons;

AreaPolygons.propTypes = {
  polygons: PropTypes.arrayOf(PropTypes.object),
  selectArea: PropTypes.func.isRequired,
  highlightArea: PropTypes.func.isRequired,
  unhighlightArea: PropTypes.func.isRequired,
};

AreaPolygons.defaultProps = {
  polygons: [],
};
