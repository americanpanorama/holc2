import { connect } from 'react-redux';
import Button from '../presentational/Button';
import { zoomOutADScan } from '../../../store/Actions';

const mapStateToProps = () => ({
  className: 'zoomOut',
  label: '-',
});

const mapDispatchToProps = {
  action: zoomOutADScan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
