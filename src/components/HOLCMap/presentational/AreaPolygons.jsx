import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, GeoJSON } from 'react-leaflet';

const AreaPolygons = ({ polygons, selectArea, mask }) => (
  <LayerGroup>
    {(mask) && (
      <GeoJSON
        data={mask}
        className="mask"
        key={`mask-${mask.properties.holc_id}`}
      />
    )}
    { polygons.map(p => (
      <GeoJSON
        data={p.area_geojson}
        className={`neighborhoodPolygon grade${p.grade}`}
        onClick={selectArea}
        id={`${p.ad_id}-${p.id}`}
        fillOpacity={p.fillOpacity}
        opacity={p.strokeOpacity}
        weight={p.weight}
        style={p.style}
        key={`areaPolygon-${p.ad_id}-${p.id}`}
      />
    ))}
  </LayerGroup>
);

export default AreaPolygons;

AreaPolygons.propTypes = {
  polygons: PropTypes.arrayOf(PropTypes.object),
  selectArea: PropTypes.func.isRequired,
  mask: PropTypes.object,
};

AreaPolygons.defaultProps = {
  polygons: [],
  mask: undefined,
};
