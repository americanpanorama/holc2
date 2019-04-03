import { connect } from 'react-redux';
import CategoryButton from '../presentational/CategoryButton';
import { selectCategory } from '../../../store/Actions';
import { getSelectedCategoryData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const catData = getSelectedCategoryData(state);
  return {
    category: catData.prevCat,
    label: (catData.prevCat) ? catData.prevCat.replace('-', '') : null,
    direction: 'previous',
  };
};

const mapDispatchToProps = {
  selectCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryButton);
