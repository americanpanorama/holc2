import { connect } from 'react-redux';
import TranscriptionButton from '../presentational/Button';
import { toggleADSelections } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const { hasADs } = getSelectedCityData(state);
  return {
    className: !hasADs ? 'inactive' : '',
    disabled: !hasADs,
    label: (state.showADSelections) ? 'Show Full' : 'Show Selections',
  };
};

const mapDispatchToProps = {
  action: toggleADSelections,
};

export default connect(mapStateToProps, mapDispatchToProps)(TranscriptionButton);
