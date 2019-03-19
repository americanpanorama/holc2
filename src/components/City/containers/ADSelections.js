import { connect } from 'react-redux';
import ADSelections from '../presentational/ADSelections';
import { selectArea } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const selectedCityData = getSelectedCityData(state);
  const { areaDescSelections: selections } = selectedCityData;

  return {
    selections,
    adId: state.selectedCity,
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(ADSelections);
