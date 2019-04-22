import { connect } from 'react-redux';
import Downloads from '../presentational/Downloads';
import { getDownloadData } from '../../../store/selectors';

const mapStateToProps = state => ({
  cityDownloads: getDownloadData(state),
});

export default connect(mapStateToProps)(Downloads);
