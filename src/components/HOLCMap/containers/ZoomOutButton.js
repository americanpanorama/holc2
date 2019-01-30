import { connect } from 'react-redux';
import Button from '../../AreaDescription/presentational/Button';
import { zoomOut } from '../../../store/Actions';

const mapStateToProps = () => ({
  className: 'zoomOut',
  label: '-',
});

const mapDispatchToProps = {
  action: zoomOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
