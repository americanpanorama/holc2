import { connect } from 'react-redux';
import CityViz from '../presentational/CityViz';
import { gradeSelected, gradeUnselected } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const selectedCityData = getSelectedCityData(state);
  const { area } = selectedCityData;
  const { selectedGrade } = state;
  let gradeStats = null;
  if (area) {
    gradeStats = [
      { grade: 'A', percent: area.a / area.total },
      { grade: 'B', percent: area.b / area.total },
      { grade: 'C', percent: area.c / area.total },
      { grade: 'D', percent: area.d / area.total },
    ];
  }
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
