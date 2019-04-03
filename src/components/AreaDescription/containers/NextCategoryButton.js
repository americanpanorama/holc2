import { connect } from 'react-redux';
import CategoryButton from '../presentational/CategoryButton';
import { selectCategory } from '../../../store/Actions';
import { getSelectedCategoryData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const catData = getSelectedCategoryData(state);
  return {
    category: catData.nextCat,
    label: (catData.nextCat) ? catData.nextCat.replace('-', '') : null,
    direction: 'next',
  };
};

const mapDispatchToProps = {
  selectCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryButton);
