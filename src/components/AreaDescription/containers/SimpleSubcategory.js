import { connect } from 'react-redux';
import SimpleSubcategory from '../presentational/SimpleSubcategory';
import { selectCategory } from '../../../store/Actions';

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
  selectCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(SimpleSubcategory);
