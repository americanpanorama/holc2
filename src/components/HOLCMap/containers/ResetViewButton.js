import { connect } from 'react-redux';
import ResetViewButton from '../presentational/ResetViewButton';
import { resetMapView } from '../../../store/Actions';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  action: resetMapView,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetViewButton);
