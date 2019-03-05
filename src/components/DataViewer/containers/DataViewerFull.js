import { connect } from 'react-redux';
import DataViewerFull from '../presentational/DataViewerFull';
import { toggleDataViewerFull } from '../../../store/Actions';

const mapStateToProps = state => ({
  show: (state.showDataViewerFull && state.selectedCategory) ? 'category' : undefined,
});

const mapDispatchToProps = {
  close: toggleDataViewerFull,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerFull);
