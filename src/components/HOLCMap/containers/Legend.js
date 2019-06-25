import { connect } from 'react-redux';
import Legend from '../presentational/Legend';
import { toggleNationalLegend } from '../../../store/Actions';

const mapStateToProps = state => ({
  show: !state.map.aboveThreshold && state.dimensions.media !== 'phone',
  showNationalLegend: state.showNationalLegend,
});

const mapDispatchToProps = {
  toggleNationalLegend,
};

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
