import { connect } from 'react-redux';
import Category from '../presentational/Category';
import { unselectCategory, toggleDataViewerFull } from '../../../store/Actions';
import { getSelectedCategoryData } from '../../../store/selectors';

const mapStateToProps = state => getSelectedCategoryData(state);

const mapDispatchToProps = {
  unselectCategory,
  toggleDataViewerFull,
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
