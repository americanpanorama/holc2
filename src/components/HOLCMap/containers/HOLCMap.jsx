import { connect } from 'react-redux';
import HOLCMap from '../presentational/HOLCMap';

const mapStateToProps = state => ({
  zoom: state.map.zoom,
  center: state.map.center,
  style: state.dimensions.mapStyle,
});

export default connect(mapStateToProps)(HOLCMap);
