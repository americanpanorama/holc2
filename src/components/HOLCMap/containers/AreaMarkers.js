import { connect } from 'react-redux';
import AreaMarkers from '../presentational/AreaMarkers';
import { getAreaMarkers } from '../../../store/selectors';

const mapStateToProps = (state) => ({
  labels: getAreaMarkers(state),
});

export default connect(mapStateToProps)(AreaMarkers);
