import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, GeoJSON } from 'react-leaflet';

const AreaPolygons = ({ polygons, selectArea, className }) => (
  <React.Fragment>
    { polygons.map(p => (
      <LayerGroup
        className={className}
        key={`areaPolygon-${p.ad_id}-${p.id}`}
      >
        <GeoJSON
          data={p.area_geojson}
          className={`neighborhoodPolygon grade${p.grade}`}
          onClick={selectArea}
          id={`${p.ad_id}-${p.id}`}
          fillOpacity={p.fillOpacity}
          opacity={p.strokeOpacity}
          style={p.style}
        />
      </LayerGroup>
    ))}

  </React.Fragment>
);

export default AreaPolygons;

AreaPolygons.propTypes = {
  polygons: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  selectArea: PropTypes.func.isRequired,
};

AreaPolygons.defaultProps = {
  polygons: [],
  className: null,
};
