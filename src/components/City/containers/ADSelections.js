import { connect } from 'react-redux';
import ADSelections from '../presentational/ADSelections';
import { selectArea, highlightArea, unhighlightArea } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const selectedCityData = getSelectedCityData(state);
  const { areaDescSelections: selections } = selectedCityData;

  return {
    selections,
    adId: state.selectedCity,
    isSearchingADs: !!state.searchingADsFor,
  };
};

const mapDispatchToProps = {
  selectArea,
  highlightArea,
  unhighlightArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(ADSelections);
