import { connect } from 'react-redux';
import CityBoundaries from '../presentational/CityBoundaries';
import { getCityBoundaries } from '../../../store/selectors';

const mapStateToProps = state => ({
  boundaries: getCityBoundaries(state),
});

export default connect(mapStateToProps)(CityBoundaries);
