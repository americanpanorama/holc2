import { connect } from 'react-redux';
import CityMarkers from '../presentational/CityMarkers';
import { selectCity } from '../../../store/Actions';
import { getCityMarkers } from '../../../store/selectors';

const mapStateToProps = state => ({
  markers: getCityMarkers(state),
});

const mapDispatchToProps = {
  selectCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityMarkers);
