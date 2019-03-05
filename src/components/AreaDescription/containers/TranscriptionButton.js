import { connect } from 'react-redux';
import TranscriptionButton from '../presentational/Button';
import { toggleADSelections } from '../../../store/Actions';

const mapStateToProps = state => ({
  label: (state.showADSelections) ? 'Show Full' : 'Show Selections',
});

const mapDispatchToProps = {
  action: toggleADSelections,
};

export default connect(mapStateToProps, mapDispatchToProps)(TranscriptionButton);
