import { connect } from 'react-redux';
import ADImage from '../presentational/ADImage';
import { updateADScan } from '../../../store/Actions';
import { getADScanMetadata } from '../../../store/selectors';

const mapStateToProps = state => ({
  adData: getADScanMetadata(state),
});

const mapDispatchToState = {
  updateADScan,
};

export default connect(mapStateToProps, mapDispatchToState)(ADImage);
