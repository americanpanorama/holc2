import { connect } from 'react-redux';
import Downloads from '../presentational/Downloads';
import { getDownloadData } from '../../../store/selectors';
import { selectCity } from '../../../store/Actions';

const mapStateToProps = state => ({
  cityDownloads: getDownloadData(state),
});

const mapDispatchToProps = {
  selectCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(Downloads);
