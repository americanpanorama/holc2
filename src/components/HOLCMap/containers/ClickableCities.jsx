import { connect } from 'react-redux';
import ClickableCities from '../presentational/ClickableCities';
import { selectCity } from '../../../store/Actions';

const mapStateToProps = state => ({
  cities: (!state.map.aboveThreshold) ? Object.keys(state.cities).map(id => state.cities[id]) : [],
});

const mapDispatchToProps = {
  onCitySelected: selectCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClickableCities);
