import { connect } from 'react-redux';
import HOLCMap from '../presentational/HOLCMap';

const mapStateToProps = (state) => {
  const { showHOLCMaps, map, dimensions } = state;
  const { zoom, center, aboveThreshold, highlightedPolygons } = map;
  const className = (showHOLCMaps && highlightedPolygons.length > 0) ? 'greyscale' : '';
  return {
    zoom,
    center,
    aboveThreshold,
    style: dimensions.mapStyle,
    className,
  };
};

export default connect(mapStateToProps)(HOLCMap);
