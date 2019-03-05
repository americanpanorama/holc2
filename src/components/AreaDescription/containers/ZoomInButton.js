import { connect } from 'react-redux';
import Button from '../presentational/Button';
import { zoomInADScan } from '../../../store/Actions';

const mapStateToProps = () => ({
  className: 'zoomIn',
  label: '+',
});

const mapDispatchToProps = {
  action: zoomInADScan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
