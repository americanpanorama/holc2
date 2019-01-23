import { connect } from 'react-redux';
import CityViz from '../presentational/CityViz';
import { gradeSelected, gradeUnselected } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { gradeStats } = state.selectedCity.data;
  const { selectedGrade } = state;
  return {
    gradeStats,
    selectedGrade,
    width: 400,
  };
};

const mapDispatchToProps = {
  gradeSelected,
  gradeUnselected,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityViz);
