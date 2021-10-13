import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, GeoJSON, FeatureGroup, CircleMarker, Tooltip } from 'react-leaflet';
import BaseMap from '../../HOLCMap/containers/BaseMap';

const NeighborhoodMap = (props) => {
  const {
    bounds,
    holcId,
    adId,
    highlightedHolcId,
    highlightedAdId,
    cityRasterParams,
    neighborhoodRasterParams,
    polygons,
    style,
    y,
    windowHeight,
  } = props;
  if (!bounds || !bounds[0] || holcId !== highlightedHolcId || adId !== highlightedAdId) {
    return null;
  }

  // adjust the style to ensure that the map is optimally positioned not exceeding the size of the
  // window or overflowing beyond the bottom
  let calculatedStyle = style;
  const padding = 30;
  const borderWidth = 2;
  if (calculatedStyle.height + padding * 2 > windowHeight) {
    calculatedStyle = {
      ...calculatedStyle,
      height: windowHeight - padding * 2 - borderWidth * 2,
      width: windowHeight - padding * 2 - borderWidth * 2,
    };
  }
  const yOverflow = y + calculatedStyle.height + padding - windowHeight;
  if (yOverflow > 0) {
    calculatedStyle = {
      ...calculatedStyle,
      top: yOverflow * -1 - padding + borderWidth,
    };
  }

  return (
    <Map
      bounds={bounds}
      zoomControl={false}
      className="neighborhoodMap greyscale"
      style={calculatedStyle}
      key={`neighborhoodMapFor-${adId}-${holcId}`}
    >
      <BaseMap />

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
  y: PropTypes.number,
  windowHeight: PropTypes.number.isRequired,
};

NeighborhoodMap.defaultProps = {
  bound: null,
  highlightedHolcId: null,
  highlightedAdId: null,
  cityRasterParams: undefined,
  neighborhoodRasterParams: undefined,
  polygons: [],
  y: null,
};
