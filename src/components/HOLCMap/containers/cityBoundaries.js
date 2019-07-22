import { connect } from 'react-redux';
import CityBoundaries from '../presentational/CityBoundaries';
import { getCityBoundaries } from '../../../store/selectors';
import { selectCity } from '../../../store/Actions';

const mapStateToProps = state => ({
  boundaries: getCityBoundaries(state),
});

const mapDispatchToProps = {
  selectCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityBoundaries);
