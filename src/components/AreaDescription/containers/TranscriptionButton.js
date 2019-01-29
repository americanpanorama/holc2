import { connect } from 'react-redux';
import TranscriptionButton from '../presentational/Button';
import { toggleADSelections } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { hasADs } = state.cities[state.selectedCity.data.id];
  return {
    className: (hasADs || !state.showADTranscriptions) ? 'inactive' : '',
    disabled: !hasADs || state.selectedCity.data.form_id === 1,
    label: (state.showADSelections) ? 'Show Full' : 'Show Selections',
  };
};

const mapDispatchToProps = {
  action: toggleADSelections,
};

export default connect(mapStateToProps, mapDispatchToProps)(TranscriptionButton);
