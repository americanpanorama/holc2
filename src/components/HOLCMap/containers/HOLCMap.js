import { connect } from 'react-redux';
import HOLCMap from '../presentational/HOLCMap';
import { clickOnMap } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { showHOLCMaps, map, dimensions, selectedGrade } = state;
  const { zoom, center, bounds, aboveThreshold, highlightedPolygons } = map;
  let className = '';
  if (showHOLCMaps && highlightedPolygons.length > 0) {
    className = `greyscale zoom-${zoom}`;
  }
  if (selectedGrade) {
    className = 'greyscale';
  }
  return {
    zoom,
    center,
    bounds,
    showHOLCMaps,
    aboveThreshold,
    style: dimensions.mapStyle,
    className,
  };
};

const mapDispatchToProps = {
  clickOnMap,
};

export default connect(mapStateToProps, mapDispatchToProps)(HOLCMap);
