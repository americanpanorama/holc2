import { connect } from 'react-redux';
import TranscriptionButton from '../presentational/Button';
import { toggleADSelections } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const { hasADs, form_id: formId } = getSelectedCityData(state);
  return {
    className: (!hasADs || formId === 1) ? 'inactive' : '',
    disabled: !hasADs || formId === 1,
    label: (state.showADSelections) ? 'Show Full' : 'Show Selections',
  };
};

const mapDispatchToProps = {
  action: toggleADSelections,
};

export default connect(mapStateToProps, mapDispatchToProps)(TranscriptionButton);
