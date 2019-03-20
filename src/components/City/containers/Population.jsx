import { connect } from 'react-redux';
import Population from '../presentational/Population';
import { getSelectedCityPopulation } from '../../../store/selectors';

const mapStateToProps = state => ({
  stats: getSelectedCityPopulation(state),
});

export default connect(mapStateToProps)(Population);
