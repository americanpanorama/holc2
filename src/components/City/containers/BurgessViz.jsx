import { connect } from 'react-redux';
import BurgessViz from '../presentational/BurgessViz';
import { ringAreaSelected, ringAreaUnselected } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { selectedGrade, selectedRingGrade, selectedCity } = state;
  const { ringStats } = selectedCity.data;
  return {
    selectedRingGrade,
    selectedGrade,
    ringStats,
    width: 400,
  };
};

const mapDispatchToProps = {
  areaSelected: ringAreaSelected,
  areaUnselected: ringAreaUnselected,
};

export default connect(mapStateToProps, mapDispatchToProps)(BurgessViz);
