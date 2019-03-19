import { connect } from 'react-redux';
import AreaMarkers from '../presentational/AreaMarkers';
import { getAreaMarkers } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const { map, selectedCity, selectedGrade, showHOLCMaps } = state;
  const { zoom } = map;
  return {
    labels: getAreaMarkers(state),
    fontSize: 21 - ((16 - zoom) * 3),
  };
};

export default connect(mapStateToProps)(AreaMarkers);
