import { connect } from 'react-redux';
import Button from '../../AreaDescription/presentational/Button';
import { toggleMapsOnOff } from '../../../store/Actions';

const mapStateToProps = state => ({
  className: (!state.showHOLCMaps) ? 'mapToggle inactive' : 'mapToggle',
  label: (state.showHOLCMaps) ? 'Hide HOLC Maps' : 'Show HOLC Maps',
  style: state.dimensions.mapToggleStyle,
});

const mapDispatchToProps = {
  action: toggleMapsOnOff,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
