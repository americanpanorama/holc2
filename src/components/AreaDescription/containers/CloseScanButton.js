import { connect } from 'react-redux';
import Button from '../presentational/Button';
import { toggleADScan } from '../../../store/Actions';

const mapStateToProps = () => ({
  className: 'closeScan',
  label: 'x',
});

const mapDispatchToProps = {
  action: toggleADScan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
