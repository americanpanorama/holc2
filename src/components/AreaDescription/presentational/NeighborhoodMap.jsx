import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, GeoJSON, FeatureGroup, CircleMarker, Tooltip } from 'react-leaflet';

const NeighborhoodMap = (props) => {
  console.log(props);
  const {
    bounds,
    holcId,
    adId,
    highlightedHolcId,
    highlightedAdId,
    basemap,
    cityRasterParams,
    neighborhoodRasterParams,
    polygons,
    style,
  } = props;
  if (!bounds || !bounds[0] || holcId !== highlightedHolcId || adId !== highlightedAdId) {
    return null;
  }

  return (
    <Map
      bounds={bounds}
      zoomControl={false}
      className="neighborhoodMap greyscale"
      style={style}
      key={`neighborhoodMapFor-${adId}-${holcId}`}
    >
      <TileLayer
        url={basemap}
        zIndex={-1}
        tileSize={512}
        zoomOffset={-1}
        detectRetina
      />

      {(cityRasterParams) && (
        <TileLayer
          url={cityRasterParams.url}
          maxNativeZoom={cityRasterParams.maxZoom}
          className="holcRaster"
          detectRetina
        />
      )}
      
      {(neighborhoodRasterParams) && (
        <TileLayer
          url={neighborhoodRasterParams.url}
          maxNativeZoom={neighborhoodRasterParams.maxNativeZoom}
          detectRetina
        />
      )}
      {polygons.map(p => (
        <FeatureGroup
          className="areaMarker"
          key={p.key}
        >
          <GeoJSON
            data={p.area_geojson}
            color={p.strokeColor}
            fillColor={p.fillColor}
            fillOpacity={p.fillOpacity}
            opacity={p.strokeOpacity}
            weight={p.weight}
          />
          <CircleMarker
            center={p.labelCoords}
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
                  fontSize: 14,
                  color: 'black',
                }}
              >
                {p.id}
              </span>
            </Tooltip>
          </CircleMarker>
        </FeatureGroup>
      ))}
    </Map>
  );
};

export default NeighborhoodMap;

NeighborhoodMap.propTypes = {
  bounds: PropTypes.arrayOf(PropTypes.array),
  holcId: PropTypes.string.isRequired,
  adId: PropTypes.number.isRequired,
  highlightedHolcId: PropTypes.string,
  highlightedAdId: PropTypes.number,
  basemap: PropTypes.string.isRequired,
  cityRasterParams: PropTypes.shape({
    url: PropTypes.string,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
  }),
  neighborhoodRasterParams: PropTypes.shape({
    url: PropTypes.string,
    maxNativeZoom: PropTypes.number,
  }),
  polygons: PropTypes.array,
  style: PropTypes.object.isRequired,
};

NeighborhoodMap.defaultProps = {
  bound: null,
  highlightedHolcId: null,
  highlightedAdId: null,
  cityRasterParams: undefined,
  neighborhoodRasterParams: undefined,
  polygons: [],
};
