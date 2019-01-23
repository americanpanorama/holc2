import { connect } from 'react-redux';
import MapToggleControl from '../presentational/MapToggleControl';
import { toggleMapsOnOff } from '../../../store/Actions';

const mapStateToProps = state => ({
  visible: state.showHOLCMaps,
  style: state.dimensions.mapToggleStyle,
});

const mapDispatchToProps = {
  toggleMaps: toggleMapsOnOff,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapToggleControl);
