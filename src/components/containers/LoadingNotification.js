import { connect } from 'react-redux';
import LoadingNotification from '../presentational/LoadingNotification';
import { getLoadingNotification } from '../../store/selectors';

const mapStateToProps = state => ({
  className: 'loading',
  text: getLoadingNotification(state),
});

export default connect(mapStateToProps)(LoadingNotification);
