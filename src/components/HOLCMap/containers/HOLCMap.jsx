import { connect } from 'react-redux';
import HOLCMap from '../presentational/HOLCMap';

const mapStateToProps = (state) => {
  const { showHOLCMaps, selectedArea, selectedGrade, map, dimensions } = state;
  const className = (showHOLCMaps && (selectedArea || selectedGrade)) ? 'greyscale' : '';
  return {
    zoom: map.zoom,
    center: map.center,
    style: dimensions.mapStyle,
    className,
  };
};

export default connect(mapStateToProps)(HOLCMap);
