import { connect } from 'react-redux';
import AreaRasters from '../presentational/AreaRasters';
import { getAreaRasters } from '../../../store/selectors';

const mapStateToProps = (state, ownProps) => ({
  maps: getAreaRasters(state),
  ...ownProps,
});

export default connect(mapStateToProps)(AreaRasters);
