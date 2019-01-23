import { connect } from 'react-redux';
import HOLCRasters from '../presentational/HOLCRasters';

const mapStateToProps = state => ({
  maps: (state.showHOLCMaps) ? state.map.visibleRasters : [],
});

export default connect(mapStateToProps)(HOLCRasters);
