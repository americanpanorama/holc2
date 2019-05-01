import { connect } from 'react-redux';
import Legend from '../presentational/Legend';

const mapStateToProps = state => ({
  show: !state.map.aboveThreshold && state.dimensions.size !== 'mobile',
});

export default connect(mapStateToProps)(Legend);
