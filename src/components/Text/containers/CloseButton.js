import { connect } from 'react-redux';
import Button from '../../AreaDescription/presentational/Button';
import { selectText } from '../../../store/Actions';

const mapStateToProps = () => ({
  className: 'close',
  label: 'x',
});

const mapDispatchToProps = {
  action: selectText,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
