import { connect } from 'react-redux';
import Button from '../../AreaDescription/presentational/Button';
import { closeText } from '../../../store/Actions';

const mapStateToProps = () => ({
  className: 'close',
  label: 'x',
});

const mapDispatchToProps = {
  action: closeText,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
