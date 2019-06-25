import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, GeoJSON } from 'react-leaflet';

const AreaPolygons = ({ polygons, selectCity }) => (
  <LayerGroup>
    { polygons.map(p => (
      <GeoJSON
        data={p.the_geojson}
        className="mapPolygon"
        onClick={selectCity}
        id={p.ad_id}
        key={`mapPolygon-${p.map_id}`}
      />
    ))}
  </LayerGroup>
);

export default AreaPolygons;

AreaPolygons.propTypes = {
  polygons: PropTypes.arrayOf(PropTypes.object),
  selectCity: PropTypes.func.isRequired,
};

AreaPolygons.defaultProps = {
  polygons: [],
};
