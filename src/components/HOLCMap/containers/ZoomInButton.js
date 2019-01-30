import { connect } from 'react-redux';
import Button from '../../AreaDescription/presentational/Button';
import { zoomIn } from '../../../store/Actions';

const mapStateToProps = () => ({
  className: 'zoomIn',
  label: '+',
});

const mapDispatchToProps = {
  action: zoomIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
