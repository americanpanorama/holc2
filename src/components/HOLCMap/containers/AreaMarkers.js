import { connect } from 'react-redux';
import AreaMarkers from '../presentational/AreaMarkers';

const mapStateToProps = state => ({
  labels: (state.selectedCity.data && !state.showHOLCMaps)
    ? state.selectedCity.data.labelPositions.map(l => ({ ...l, ad_id: state.selectedCity.id }))
    : [],
});

export default connect(mapStateToProps)(AreaMarkers);
