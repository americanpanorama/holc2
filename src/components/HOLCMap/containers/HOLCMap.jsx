import { connect } from 'react-redux';
import HOLCMap from '../presentational/HOLCMap';

const mapStateToProps = (state) => {
  const { showHOLCMaps, selectedArea, selectedGrade, map, dimensions, adSearchHOLCIds } = state;
  const { zoom, center, aboveThreshold } = map;
  const className = (showHOLCMaps && (selectedArea || selectedGrade || adSearchHOLCIds.length > 0)) ? 'greyscale' : '';
  return {
    zoom,
    center,
    aboveThreshold,
    style: dimensions.mapStyle,
    className,
  };
};

export default connect(mapStateToProps)(HOLCMap);
