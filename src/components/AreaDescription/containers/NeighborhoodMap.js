import { connect } from 'react-redux';
import NeighborhoodMap from '../presentational/NeighborhoodMap';
import { getInspectedMiniMapParams } from '../../../store/selectors';
import { constantsColors } from '../../../../data/constants';

const mapStateToProps = (state) => {
  const { bounds, zoom, lat, lng, highlightedAdId, highlightedHolcId } = getInspectedMiniMapParams(state);
  const { basemap, map, selectedCity, showHOLCMaps, showFullHOLCMaps, selectedArea, dimensions } = state;
  const { visibleRasters, highlightedPolygons, visiblePolygons } = map;

  let cityRasterParams;
  let neighborhoodRasterParams;
  let polygons = [];
  // get the style
  let style = {
    left: dimensions.adFullViewWidth + 10,
  };

  const cityRaster = visibleRasters.find(vr => vr.id === selectedCity);

  // this will need insets too
  if (cityRaster && showHOLCMaps) {
    cityRasterParams = {
      url: (showFullHOLCMaps) ? cityRaster.url : cityRaster.url.replace('/tiles/', '/tiles_mosaic/'),
      maxZoom: cityRaster.maxZoom,
      minZoom: cityRaster.minZoom,
    };
  }

  let inspectedPolygon;
  if (highlightedPolygons.length === 1) {
    inspectedPolygon = highlightedPolygons[0];
  } else {
    const highlightedSansSelected = highlightedPolygons
      .filter(hp => hp.holcId !== selectedArea || hp.adId !== selectedCity);
    if (highlightedSansSelected.length === 1) {
      inspectedPolygon = highlightedSansSelected[0];
    }
  }
  if (inspectedPolygon) {
    const { adId, holcId} = inspectedPolygon;
    const { neighborhoodId, grade } = visiblePolygons.find(p => p.ad_id === adId && p.id === holcId);
    if (grade === 'C' || grade === 'D') {
      style = {
        right: dimensions.adFullViewWidth * 1 + 10,
      };
    }

    if (showHOLCMaps) {
      neighborhoodRasterParams = {
        url: `//s3.amazonaws.com/holc/polygon_tiles/${neighborhoodId}/{z}/{x}/{y}.png`,
        maxNativeZoom: (cityRasterParams) ? cityRasterParams.maxZoom : 15,
      };
    } else {
      // calculate the style each polygon
      const zFillOpacity = 0.95 - Math.min((13 - 9) / 4, 1) * 0.75;

      polygons = visiblePolygons.map((p) => {
        const fillColor = constantsColors[`grade${p.grade}`];
        let fillOpacity = Math.max(0.2, zFillOpacity * 0.5);
        let strokeColor = '#888'; //constantsColors[`grade${p.grade}`];
        const strokeOpacity = 0.5;
        let weight = 0.5;
        const key = (p.arbId) ? `areaPolygon-${p.ad_id}-${p.arbId}` :
          `areaPolygonNeighborhoodMap-${p.ad_id}-${p.id}`;

        if (adId === p.ad_id && holcId === p.id) {
          weight = 3;
          fillOpacity = Math.min(0.9, zFillOpacity * 2);
          strokeColor = 'black';
        }

        return {
          ...p,
          key,
          fillColor,
          fillOpacity,
          strokeColor,
          strokeOpacity,
          weight,
        };
      });
    }
  }

  return {
    bounds,
    zoom,
    lat,
    lng,
    highlightedAdId,
    highlightedHolcId,
    basemap,
    cityRasterParams,
    neighborhoodRasterParams,
    polygons,
    style,
  };
};

export default connect(mapStateToProps)(NeighborhoodMap);
