import { connect } from 'react-redux';
import HOLCMap from '../presentational/HOLCMap';
import { clickOnMap } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { showHOLCMaps, map, dimensions } = state;
  const { zoom, center, bounds, aboveThreshold, highlightedPolygons } = map;
  const className = (showHOLCMaps && highlightedPolygons.length > 0) ? 'greyscale' : '';
  return {
    zoom,
    center,
    bounds,
    aboveThreshold,
    style: dimensions.mapStyle,
    className,
  };
};

const mapDispatchToProps = {
  clickOnMap,
};

export default connect(mapStateToProps, mapDispatchToProps)(HOLCMap);
