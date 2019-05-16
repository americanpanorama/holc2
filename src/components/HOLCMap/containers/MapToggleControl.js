import { connect } from 'react-redux';
import Button from '../../AreaDescription/presentational/Button';
import { toggleMapsOnOff } from '../../../store/Actions';

const mapStateToProps = state => ({
  className: (state.map.zoom <= 8) ? 'mapToggle dontDisplay' : 'mapToggle',
  label: (state.showHOLCMaps) ? 'Hide Scans' : 'Show Scans',
  style: state.dimensions.mapToggleStyle,
});

const mapDispatchToProps = {
  action: toggleMapsOnOff,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
