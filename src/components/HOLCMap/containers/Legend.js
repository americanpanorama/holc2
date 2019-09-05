import { connect } from 'react-redux';
import Legend from '../presentational/Legend';
import { toggleNationalLegend, toggleCityMarkerStyle } from '../../../store/Actions';

const mapStateToProps = state => ({
  show: !state.map.aboveThreshold && state.dimensions.media !== 'phone',
  showNationalLegend: state.showNationalLegend,
  donutCityMarkers: state.donutCityMarkers,
});

const mapDispatchToProps = {
  toggleNationalLegend,
  toggleCityMarkerStyle,
};

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
