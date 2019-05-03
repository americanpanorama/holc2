import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, GeoJSON } from 'react-leaflet';
import { HEADER_RED_COLOR } from '../../../../data/constants';

const AreaPolygons = ({ overlappingMaps, bringMapToFront }) => {
  return (
    <LayerGroup>
      { overlappingMaps.map(p => (
        <GeoJSON
          data={p.the_geojson}
          fillColor={HEADER_RED_COLOR}
          fillOpacity={0.25}
          color={HEADER_RED_COLOR}
          weight={p.weight}
          key={`${p.id}-${p.sortOrder}`}
          //onClick={bringMapToFront}
          id={p.id}
        />
      ))}
    </LayerGroup>
  );
};

export default AreaPolygons;

AreaPolygons.propTypes = {
  overlappingMaps: PropTypes.arrayOf(PropTypes.object),
  bringMapToFront: PropTypes.func.isRequired,
};
