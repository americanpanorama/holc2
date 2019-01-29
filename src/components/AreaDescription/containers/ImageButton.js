import { connect } from 'react-redux';
import Button from '../presentational/Button';
import { toggleADTranscription } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { hasADs, hasImages } = state.cities[state.selectedCity.data.id];
  return {
    className: (!hasADs || !hasImages) ? 'inactive' : '',
    disabled: !hasADs || !hasImages,
    label: (state.showADTranscriptions) ? 'Show Image' : 'Show Transcription',
  };
};

const mapDispatchToProps = {
  action: toggleADTranscription,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
