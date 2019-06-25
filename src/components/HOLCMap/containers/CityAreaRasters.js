import { connect } from 'react-redux';
import AreaRasters from '../presentational/AreaRasters';
import { getCityAreaRasters } from '../../../store/selectors';

const mapStateToProps = (state, ownProps) => ({
  maps: getCityAreaRasters(state),
  ...ownProps,
});

export default connect(mapStateToProps)(AreaRasters);
