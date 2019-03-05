import { connect } from 'react-redux';
import Button from '../presentational/Button';
import { toggleADTranscription } from '../../../store/Actions';

const mapStateToProps = () => ({
  className: 'closeScan',
  label: 'x',
});

const mapDispatchToProps = {
  action: toggleADTranscription,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
