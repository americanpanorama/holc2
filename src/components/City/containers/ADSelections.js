import { connect } from 'react-redux';
import ADSelections from '../presentational/ADSelections';
import { selectArea, highlightArea, unhighlightArea } from '../../../store/Actions';
import { getSelectedCityADSelections } from '../../../store/selectors';

const mapStateToProps = state => ({
  selections: getSelectedCityADSelections(state),
  adId: state.selectedCity,
  isSearchingADs: !!state.searchingADsFor,
});

const mapDispatchToProps = {
  selectArea,
  highlightArea,
  unhighlightArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(ADSelections);
